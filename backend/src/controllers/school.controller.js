const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const School = require('../models/School');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

// @desc    Register school
// @route   POST /api/v1/schools/register
// @access  Public
exports.registerSchool = catchAsync(async (req, res, next) => {
  const existing = await School.findOne({ email: req.body.email });
  if (existing) return next(new AppError('A school with this email already exists.', 409));

  const school = await School.create(req.body);
  successResponse(res, 'School registration submitted. Pending admin verification.', { school }, 201);
});

// @desc    Get all schools (admin)
// @route   GET /api/v1/schools
// @access  Admin
exports.getAllSchools = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, search, state, board, status, sort = '-createdAt' } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { schoolName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { schoolCode: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
    ];
  }
  if (state) query['address.state'] = state;
  if (board) query.board = board;
  if (status) query.verificationStatus = status;

  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    sort,
  };

  const result = await School.paginate(query, options);
  paginatedResponse(res, 'Schools fetched.', result.docs, result);
});

// @desc    Get single school
// @route   GET /api/v1/schools/:id
// @access  Admin / Public (basic info)
exports.getSchool = catchAsync(async (req, res, next) => {
  const school = await School.findById(req.params.id);
  if (!school) return next(new AppError('School not found.', 404));
  successResponse(res, 'School fetched.', { school });
});

// @desc    Update school verification status
// @route   PATCH /api/v1/schools/:id/verify
// @access  Admin
exports.verifySchool = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;

  if (!['verified', 'rejected', 'suspended'].includes(status)) {
    return next(new AppError('Invalid status. Use: verified, rejected, suspended', 400));
  }

  const school = await School.findByIdAndUpdate(
    req.params.id,
    {
      verificationStatus: status,
      verificationNote: note,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    },
    { new: true }
  );

  if (!school) return next(new AppError('School not found.', 404));
  successResponse(res, `School ${status} successfully.`, { school });
});

// @desc    Update school
// @route   PATCH /api/v1/schools/:id
// @access  Admin
exports.updateSchool = catchAsync(async (req, res, next) => {
  const school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!school) return next(new AppError('School not found.', 404));
  successResponse(res, 'School updated.', { school });
});

// @desc    Delete school
// @route   DELETE /api/v1/schools/:id
// @access  Super Admin
exports.deleteSchool = catchAsync(async (req, res, next) => {
  const school = await School.findByIdAndDelete(req.params.id);
  if (!school) return next(new AppError('School not found.', 404));
  successResponse(res, 'School deleted.');
});

// @desc    Get school stats
// @route   GET /api/v1/schools/stats
// @access  Admin
exports.getSchoolStats = catchAsync(async (req, res, next) => {
  const [total, verified, pending, rejected] = await Promise.all([
    School.countDocuments(),
    School.countDocuments({ verificationStatus: 'verified' }),
    School.countDocuments({ verificationStatus: 'pending' }),
    School.countDocuments({ verificationStatus: 'rejected' }),
  ]);

  const stateWise = await School.aggregate([
    { $group: { _id: '$address.state', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 15 },
  ]);

  const boardWise = await School.aggregate([
    { $group: { _id: '$board', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  successResponse(res, 'School stats.', { total, verified, pending, rejected, stateWise, boardWise });
});
