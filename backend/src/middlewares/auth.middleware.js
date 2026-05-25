const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

/**
 * Verify access token and attach user to request
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError('Access denied. Please log in.', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again.', 401));
    }
    return next(new AppError('Invalid token. Please log in again.', 401));
  }

  // Get user based on role
  let user;
  if (decoded.role === 'student') {
    user = await Student.findById(decoded.id).select('-password -refreshToken');
  } else {
    user = await Admin.findById(decoded.id).select('-password -refreshToken');
  }

  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Contact support.', 403));
  }

  req.user = user;
  req.userRole = decoded.role;
  next();
});

/**
 * Protect admin routes - admin panel only
 */
const protectAdmin = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.adminAccessToken) {
    token = req.cookies.adminAccessToken;
  }

  if (!token) {
    return next(new AppError('Admin access required. Please log in.', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired token.', 401));
  }

  if (decoded.role === 'student') {
    return next(new AppError('Admin access required.', 403));
  }

  const admin = await Admin.findById(decoded.id).select('-password -refreshToken');
  if (!admin || !admin.isActive) {
    return next(new AppError('Admin account not found or deactivated.', 401));
  }

  req.user = admin;
  req.userRole = decoded.role;
  next();
});

/**
 * Restrict to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role) && !roles.includes(req.userRole)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

/**
 * Check specific permission
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role === 'super_admin') return next();
    if (!req.user.permissions || !req.user.permissions[permission]) {
      return next(new AppError(`You don't have permission: ${permission}`, 403));
    }
    next();
  };
};

module.exports = { protect, protectAdmin, restrictTo, requirePermission };
