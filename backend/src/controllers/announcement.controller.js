const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Announcement = require('../models/Announcement');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');

// @desc    Create announcement
// @route   POST /api/v1/announcements
// @access  Admin (announcements permission)
exports.createAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
  successResponse(res, 'Announcement created.', { announcement }, 201);
});

// @desc    Get all announcements (public - published only)
// @route   GET /api/v1/announcements
// @access  Public
exports.getAnnouncements = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, type, priority, search } = req.query;
  const isAdmin = req.userRole && req.userRole !== 'student';

  const query = {};
  if (!isAdmin) {
    query.isPublished = true;
    query.$or = [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }];
  }
  if (type) query.type = type;
  if (priority) query.priority = priority;
  if (search) query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
  ];

  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 50),
    sort: { isPinned: -1, createdAt: -1 },
    populate: [{ path: 'createdBy', select: 'fullName' }],
  };

  const result = await Announcement.paginate(query, options);
  paginatedResponse(res, 'Announcements fetched.', result.docs, result);
});

// @desc    Get single announcement
// @route   GET /api/v1/announcements/:id
// @access  Public
exports.getAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id).populate('createdBy', 'fullName');
  if (!announcement) return next(new AppError('Announcement not found.', 404));

  // Increment views
  await Announcement.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  successResponse(res, 'Announcement fetched.', { announcement });
});

// @desc    Update announcement
// @route   PATCH /api/v1/announcements/:id
// @access  Admin
exports.updateAnnouncement = catchAsync(async (req, res, next) => {
  const update = { ...req.body, updatedBy: req.user._id };
  if (req.body.isPublished && !req.body.publishedAt) update.publishedAt = new Date();

  const announcement = await Announcement.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!announcement) return next(new AppError('Announcement not found.', 404));
  successResponse(res, 'Announcement updated.', { announcement });
});

// @desc    Delete announcement
// @route   DELETE /api/v1/announcements/:id
// @access  Admin
exports.deleteAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) return next(new AppError('Announcement not found.', 404));
  successResponse(res, 'Announcement deleted.');
});

// @desc    Get latest announcements for homepage
// @route   GET /api/v1/announcements/latest
// @access  Public
exports.getLatestAnnouncements = catchAsync(async (req, res, next) => {
  const announcements = await Announcement.find({
    isPublished: true,
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  })
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(5)
    .select('title type priority isPinned createdAt');

  successResponse(res, 'Latest announcements.', { announcements });
});
