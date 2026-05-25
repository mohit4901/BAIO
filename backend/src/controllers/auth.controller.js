const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Student = require('../models/Student');
const emailService = require('../services/email.service');
const tokenService = require('../services/token.service');
const crypto = require('crypto');
const { successResponse } = require('../utils/responseHelper');

// @desc    Register student
// @route   POST /api/v1/auth/student/register
// @access  Public
exports.registerStudent = catchAsync(async (req, res, next) => {
  const { fullName, email, mobile, password, class: cls, schoolName, city, state } = req.body;

  const existingStudent = await Student.findOne({ email });
  if (existingStudent) return next(new AppError('Email already registered.', 409));

  const verificationToken = tokenService.generateRandomToken();
  const hashedToken = tokenService.hashToken(verificationToken);

  const student = await Student.create({
    fullName, email, mobile, password, class: cls, schoolName, city, state,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  try {
    await emailService.sendEmailVerification(email, fullName, verificationToken);
    await emailService.sendWelcome(student);
  } catch (err) {
    // Don't fail registration if email fails
  }

  const { accessToken, refreshToken } = tokenService.generateTokenPair(student._id, 'student');
  await Student.findByIdAndUpdate(student._id, { refreshToken });
  tokenService.setAuthCookies(res, accessToken, refreshToken);

  successResponse(res, 'Registration successful! Please check your email to verify your account.', {
    student: student.toSafeObject(),
    accessToken,
  }, 201);
});

// @desc    Login student
// @route   POST /api/v1/auth/student/login
// @access  Public
exports.loginStudent = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Email and password are required.', 400));

  const student = await Student.findOne({ email }).select('+password');
  if (!student || !(await student.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (!student.isActive) return next(new AppError('Account deactivated. Contact support.', 403));

  const { accessToken, refreshToken } = tokenService.generateTokenPair(student._id, 'student');
  await Student.findByIdAndUpdate(student._id, { refreshToken, lastLogin: new Date() });
  tokenService.setAuthCookies(res, accessToken, refreshToken);

  successResponse(res, 'Login successful!', {
    student: student.toSafeObject(),
    accessToken,
  });
});

// @desc    Admin login
// @route   POST /api/v1/auth/admin/login
// @access  Public
exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Email and password are required.', 400));

  const Admin = require('../models/Admin');
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    return next(new AppError('Invalid credentials.', 401));
  }
  if (!admin.isActive) return next(new AppError('Account deactivated.', 403));

  const { accessToken, refreshToken } = tokenService.generateTokenPair(admin._id, admin.role);
  await Admin.findByIdAndUpdate(admin._id, { refreshToken, lastLogin: new Date(), lastLoginIp: req.ip });
  tokenService.setAuthCookies(res, accessToken, refreshToken, true);

  const adminData = admin.toObject();
  delete adminData.password;
  delete adminData.refreshToken;

  successResponse(res, 'Admin login successful!', { admin: adminData, accessToken });
});

// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = catchAsync(async (req, res, next) => {
  const isAdmin = req.userRole !== 'student';
  tokenService.clearAuthCookies(res, isAdmin);

  if (req.userRole === 'student') {
    await Student.findByIdAndUpdate(req.user._id, { refreshToken: null });
  } else {
    const Admin = require('../models/Admin');
    await Admin.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }

  successResponse(res, 'Logged out successfully.');
});

// @desc    Refresh tokens
// @route   POST /api/v1/auth/refresh
// @access  Public (with refresh token)
exports.refreshTokens = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken || req.cookies.adminRefreshToken || req.body.refreshToken;
  if (!token) return next(new AppError('Refresh token required.', 401));

  let decoded;
  try {
    decoded = tokenService.verifyRefreshToken(token);
  } catch {
    return next(new AppError('Invalid or expired refresh token.', 401));
  }

  let user;
  const isAdmin = decoded.role !== 'student';
  if (!isAdmin) {
    user = await Student.findOne({ _id: decoded.id }).select('+refreshToken');
  } else {
    const Admin = require('../models/Admin');
    user = await Admin.findOne({ _id: decoded.id }).select('+refreshToken');
  }

  if (!user || user.refreshToken !== token) {
    return next(new AppError('Invalid refresh token.', 401));
  }

  const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokenPair(user._id, decoded.role);
  await user.constructor.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
  tokenService.setAuthCookies(res, accessToken, newRefreshToken, isAdmin);

  successResponse(res, 'Tokens refreshed.', { accessToken });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email, userType } = req.body;

  let user;
  if (userType === 'admin') {
    const Admin = require('../models/Admin');
    user = await Admin.findOne({ email });
  } else {
    user = await Student.findOne({ email });
  }

  // Always return success to prevent email enumeration
  if (!user) {
    return successResponse(res, 'If the email exists, a reset link has been sent.');
  }

  const resetToken = tokenService.generateRandomToken();
  const hashedToken = tokenService.hashToken(resetToken);

  await user.constructor.findByIdAndUpdate(user._id, {
    passwordResetToken: hashedToken,
    passwordResetExpires: Date.now() + 10 * 60 * 1000,
  });

  try {
    await emailService.sendPasswordReset(email, user.fullName, resetToken);
  } catch {
    await user.constructor.findByIdAndUpdate(user._id, { passwordResetToken: null, passwordResetExpires: null });
    return next(new AppError('Email could not be sent. Please try again.', 500));
  }

  successResponse(res, 'If the email exists, a reset link has been sent.');
});

// @desc    Reset password
// @route   PATCH /api/v1/auth/reset-password/:token
// @access  Public
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = tokenService.hashToken(req.params.token);
  const { password, userType } = req.body;

  let user;
  const query = { passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } };

  if (userType === 'admin') {
    const Admin = require('../models/Admin');
    user = await Admin.findOne(query);
  } else {
    user = await Student.findOne(query);
  }

  if (!user) return next(new AppError('Invalid or expired reset token.', 400));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  successResponse(res, 'Password reset successful. Please log in.');
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = tokenService.hashToken(req.params.token);
  const student = await Student.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!student) return next(new AppError('Invalid or expired verification link.', 400));

  await Student.findByIdAndUpdate(student._id, {
    isEmailVerified: true,
    emailVerificationToken: undefined,
    emailVerificationExpires: undefined,
  });

  successResponse(res, 'Email verified successfully!');
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = catchAsync(async (req, res, next) => {
  successResponse(res, 'User profile fetched.', { user: req.user });
});
