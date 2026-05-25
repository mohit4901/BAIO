const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Olympiad = require('../models/Olympiad');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');
const uploadService = require('../services/upload.service');

// @desc    Create olympiad
// @route   POST /api/v1/olympiads
// @access  Admin (content_admin, super_admin)
exports.createOlympiad = catchAsync(async (req, res, next) => {
  const olympiad = await Olympiad.create({ ...req.body, createdBy: req.user._id });
  successResponse(res, 'Olympiad created successfully.', { olympiad }, 201);
});

// @desc    Get all olympiads (public)
// @route   GET /api/v1/olympiads
// @access  Public
exports.getAllOlympiads = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 12, category, status, isFeatured, search, sort = '-createdAt' } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (status) query.status = status;
  if (isFeatured === 'true') query.isFeatured = true;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 50),
    sort,
    select: 'title slug shortDescription category status examDate registrationLastDate bannerImage isFeatured totalRegistrations eligibility isFree registrationFee',
  };

  const result = await Olympiad.paginate(query, options);
  paginatedResponse(res, 'Olympiads fetched.', result.docs, result);
});

// @desc    Get single olympiad by slug
// @route   GET /api/v1/olympiads/:slug
// @access  Public
exports.getOlympiad = catchAsync(async (req, res, next) => {
  const olympiad = await Olympiad.findOne({ slug: req.params.slug, isActive: true })
    .populate('createdBy', 'fullName');

  if (!olympiad) return next(new AppError('Olympiad not found.', 404));
  successResponse(res, 'Olympiad fetched.', { olympiad });
});

// @desc    Update olympiad
// @route   PATCH /api/v1/olympiads/:id
// @access  Admin
exports.updateOlympiad = catchAsync(async (req, res, next) => {
  const olympiad = await Olympiad.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!olympiad) return next(new AppError('Olympiad not found.', 404));
  successResponse(res, 'Olympiad updated.', { olympiad });
});

// @desc    Delete olympiad
// @route   DELETE /api/v1/olympiads/:id
// @access  Super Admin
exports.deleteOlympiad = catchAsync(async (req, res, next) => {
  const olympiad = await Olympiad.findByIdAndDelete(req.params.id);
  if (!olympiad) return next(new AppError('Olympiad not found.', 404));
  successResponse(res, 'Olympiad deleted.');
});

// @desc    Upload olympiad banner
// @route   POST /api/v1/olympiads/:id/banner
// @access  Admin
exports.uploadBanner = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded.', 400));
  const result = await uploadService.uploadOlympiadBanner(req.file.path, req.params.id);
  const olympiad = await Olympiad.findByIdAndUpdate(req.params.id, { bannerImage: result }, { new: true });
  successResponse(res, 'Banner uploaded.', { olympiad });
});

// @desc    Upload syllabus
// @route   POST /api/v1/olympiads/:id/syllabus
// @access  Admin
exports.uploadSyllabus = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded.', 400));
  const result = await uploadService.uploadSyllabus(req.file.path, req.params.id);
  const olympiad = await Olympiad.findByIdAndUpdate(req.params.id, { syllabus: result }, { new: true });
  successResponse(res, 'Syllabus uploaded.', { olympiad });
});

// @desc    Get featured olympiads
// @route   GET /api/v1/olympiads/featured
// @access  Public
exports.getFeaturedOlympiads = catchAsync(async (req, res, next) => {
  const olympiads = await Olympiad.find({ isFeatured: true, isActive: true, status: { $ne: 'draft' } })
    .sort('-createdAt')
    .limit(6)
    .select('title slug shortDescription category status examDate bannerImage isFeatured totalRegistrations');
  successResponse(res, 'Featured olympiads fetched.', { olympiads });
});

// @desc    Get olympiad stats
// @route   GET /api/v1/olympiads/stats
// @access  Admin
exports.getOlympiadStats = catchAsync(async (req, res, next) => {
  const [total, active, upcoming, completed] = await Promise.all([
    Olympiad.countDocuments(),
    Olympiad.countDocuments({ status: 'registration_open' }),
    Olympiad.countDocuments({ status: 'upcoming' }),
    Olympiad.countDocuments({ status: 'completed' }),
  ]);

  const categoryWise = await Olympiad.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 }, totalRegistrations: { $sum: '$totalRegistrations' } } },
    { $sort: { totalRegistrations: -1 } },
  ]);

  successResponse(res, 'Olympiad stats.', { total, active, upcoming, completed, categoryWise });
});
