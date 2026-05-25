const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Student = require('../models/Student');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');
const uploadService = require('../services/upload.service');

// @desc    Get all students (admin)
// @route   GET /api/v1/students
// @access  Admin
exports.getAllStudents = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, search, state, class: cls, olympiad, sort = '-createdAt' } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
    ];
  }
  if (state) query.state = state;
  if (cls) query.class = cls;
  if (olympiad) query['registeredOlympiads.olympiad'] = olympiad;

  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    sort,
    select: '-password -refreshToken -emailVerificationToken -passwordResetToken',
    populate: [{ path: 'registeredOlympiads.olympiad', select: 'title slug category' }],
  };

  const result = await Student.paginate(query, options);
  paginatedResponse(res, 'Students fetched successfully.', result.docs, result);
});

// @desc    Get single student
// @route   GET /api/v1/students/:id
// @access  Admin / Self
exports.getStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .select('-password -refreshToken')
    .populate('registeredOlympiads.olympiad', 'title slug category examDate');

  if (!student) return next(new AppError('Student not found.', 404));

  // Allow student to access their own data or admin
  if (req.userRole === 'student' && req.user._id.toString() !== req.params.id) {
    return next(new AppError('Access denied.', 403));
  }

  successResponse(res, 'Student fetched.', { student });
});

// @desc    Get my profile (student)
// @route   GET /api/v1/students/me
// @access  Student
exports.getMyProfile = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.user._id)
    .select('-password -refreshToken')
    .populate('registeredOlympiads.olympiad', 'title slug category examDate status bannerImage');
  successResponse(res, 'Profile fetched.', { student });
});

// @desc    Update student profile
// @route   PATCH /api/v1/students/me
// @access  Student
exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const { fullName, mobile, city, state, schoolName, class: cls, section, dateOfBirth, gender } = req.body;

  const updateData = { fullName, mobile, city, state, schoolName, class: cls, section, dateOfBirth, gender };
  // Remove undefined fields
  Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

  const student = await Student.findByIdAndUpdate(req.user._id, updateData, {
    new: true, runValidators: true,
  }).select('-password -refreshToken');

  successResponse(res, 'Profile updated successfully.', { student });
});

// @desc    Upload profile photo
// @route   POST /api/v1/students/me/photo
// @access  Student
exports.uploadProfilePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded.', 400));

  // Delete old photo if exists
  const student = await Student.findById(req.user._id);
  if (student.profilePhoto?.publicId) {
    await uploadService.deleteFile(student.profilePhoto.publicId);
  }

  const result = await uploadService.uploadProfilePhoto(req.file.path, student._id);
  const updated = await Student.findByIdAndUpdate(
    req.user._id,
    { profilePhoto: result },
    { new: true }
  ).select('-password -refreshToken');

  successResponse(res, 'Profile photo updated.', { student: updated });
});

// @desc    Register for olympiad
// @route   POST /api/v1/students/me/register-olympiad/:olympiadId
// @access  Student
exports.registerForOlympiad = catchAsync(async (req, res, next) => {
  const { olympiadId } = req.params;
  const Olympiad = require('../models/Olympiad');

  const olympiad = await Olympiad.findById(olympiadId);
  if (!olympiad) return next(new AppError('Olympiad not found.', 404));

  if (!olympiad.isRegistrationOpen) {
    return next(new AppError('Registration is not currently open for this olympiad.', 400));
  }

  const student = await Student.findById(req.user._id);
  const alreadyRegistered = student.registeredOlympiads.some(
    (r) => r.olympiad.toString() === olympiadId
  );

  if (alreadyRegistered) return next(new AppError('Already registered for this olympiad.', 400));

  student.registeredOlympiads.push({ olympiad: olympiadId, paymentStatus: olympiad.isFree ? 'free' : 'pending' });
  await student.save();

  await Olympiad.findByIdAndUpdate(olympiadId, { $inc: { totalRegistrations: 1 } });

  successResponse(res, 'Successfully registered for the olympiad!', {
    olympiad: { title: olympiad.title, examDate: olympiad.examDate },
  });
});

// @desc    Update student (admin)
// @route   PATCH /api/v1/students/:id
// @access  Admin
exports.updateStudent = catchAsync(async (req, res, next) => {
  const allowedFields = ['fullName', 'mobile', 'city', 'state', 'isActive', 'class', 'schoolName'];
  const updateData = {};
  allowedFields.forEach((f) => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

  const student = await Student.findByIdAndUpdate(req.params.id, updateData, {
    new: true, runValidators: true,
  }).select('-password -refreshToken');

  if (!student) return next(new AppError('Student not found.', 404));
  successResponse(res, 'Student updated.', { student });
});

// @desc    Delete student (admin)
// @route   DELETE /api/v1/students/:id
// @access  Super Admin
exports.deleteStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return next(new AppError('Student not found.', 404));
  successResponse(res, 'Student deleted.');
});

// @desc    Get students stats for dashboard
// @route   GET /api/v1/students/stats
// @access  Admin
exports.getStudentStats = catchAsync(async (req, res, next) => {
  const [total, verified, thisMonth] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ isEmailVerified: true }),
    Student.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
  ]);

  const stateWise = await Student.aggregate([
    { $group: { _id: '$state', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const classWise = await Student.aggregate([
    { $group: { _id: '$class', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  successResponse(res, 'Student stats fetched.', { total, verified, thisMonth, stateWise, classWise });
});
