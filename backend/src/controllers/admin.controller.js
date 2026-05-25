const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Admin = require('../models/Admin');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

// @desc    Get all admins
// @route   GET /api/v1/admins
// @access  Super Admin
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find().select('-password -refreshToken').sort('-createdAt');
  successResponse(res, 'Admins fetched.', { admins, total: admins.length });
});

// @desc    Create admin
// @route   POST /api/v1/admins
// @access  Super Admin
exports.createAdmin = catchAsync(async (req, res, next) => {
  const { fullName, email, password, role, permissions, phone, department } = req.body;

  const existing = await Admin.findOne({ email });
  if (existing) return next(new AppError('Admin with this email already exists.', 409));

  const admin = await Admin.create({
    fullName, email, password, role, permissions, phone, department,
    createdBy: req.user._id,
  });

  const adminData = admin.toObject();
  delete adminData.password;
  successResponse(res, 'Admin created.', { admin: adminData }, 201);
});

// @desc    Get single admin
// @route   GET /api/v1/admins/:id
// @access  Super Admin
exports.getAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id).select('-password -refreshToken');
  if (!admin) return next(new AppError('Admin not found.', 404));
  successResponse(res, 'Admin fetched.', { admin });
});

// @desc    Update admin
// @route   PATCH /api/v1/admins/:id
// @access  Super Admin
exports.updateAdmin = catchAsync(async (req, res, next) => {
  const { fullName, role, permissions, isActive, phone, department } = req.body;
  const admin = await Admin.findByIdAndUpdate(
    req.params.id,
    { fullName, role, permissions, isActive, phone, department },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');
  if (!admin) return next(new AppError('Admin not found.', 404));
  successResponse(res, 'Admin updated.', { admin });
});

// @desc    Delete admin
// @route   DELETE /api/v1/admins/:id
// @access  Super Admin
exports.deleteAdmin = catchAsync(async (req, res, next) => {
  if (req.params.id === req.user._id.toString()) {
    return next(new AppError('Cannot delete your own account.', 400));
  }
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) return next(new AppError('Admin not found.', 404));
  successResponse(res, 'Admin deleted.');
});

// @desc    Get dashboard analytics
// @route   GET /api/v1/admins/dashboard
// @access  Admin (analytics permission)
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const Student = require('../models/Student');
  const School = require('../models/School');
  const Olympiad = require('../models/Olympiad');
  const Announcement = require('../models/Announcement');

  const [
    totalStudents, totalSchools, totalOlympiads, totalAnnouncements,
    newStudentsThisMonth, pendingSchools, activeOlympiads,
    recentStudents, recentSchools,
  ] = await Promise.all([
    Student.countDocuments(),
    School.countDocuments(),
    Olympiad.countDocuments(),
    Announcement.countDocuments({ isPublished: true }),
    Student.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
    School.countDocuments({ verificationStatus: 'pending' }),
    Olympiad.countDocuments({ status: 'registration_open' }),
    Student.find().sort('-createdAt').limit(5).select('fullName email class city state createdAt'),
    School.find().sort('-createdAt').limit(5).select('schoolName principalName email verificationStatus createdAt'),
  ]);

  // Monthly registrations (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRegistrations = await Student.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  successResponse(res, 'Dashboard stats.', {
    overview: { totalStudents, totalSchools, totalOlympiads, totalAnnouncements },
    highlights: { newStudentsThisMonth, pendingSchools, activeOlympiads },
    recentActivity: { recentStudents, recentSchools },
    charts: { monthlyRegistrations },
  });
});
