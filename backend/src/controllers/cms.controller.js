const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const CMS = require('../models/CMS');
const { successResponse } = require('../utils/responseHelper');

// @desc    Get CMS item by key
// @route   GET /api/v1/cms/:key
// @access  Public
exports.getCMSItem = catchAsync(async (req, res, next) => {
  const item = await CMS.findOne({ key: req.params.key, isActive: true });
  if (!item) return next(new AppError('Content not found.', 404));
  successResponse(res, 'Content fetched.', { item });
});

// @desc    Get CMS items by type
// @route   GET /api/v1/cms/type/:type
// @access  Public
exports.getCMSByType = catchAsync(async (req, res, next) => {
  const items = await CMS.find({ type: req.params.type, isActive: true }).sort('order');
  successResponse(res, 'Content fetched.', { items });
});

// @desc    Upsert CMS item
// @route   PUT /api/v1/cms/:key
// @access  Admin (cms permission)
exports.upsertCMSItem = catchAsync(async (req, res, next) => {
  const item = await CMS.findOneAndUpdate(
    { key: req.params.key },
    { ...req.body, key: req.params.key, updatedBy: req.user._id },
    { upsert: true, new: true, runValidators: true }
  );
  successResponse(res, 'Content updated.', { item });
});

// @desc    Get all CMS items (admin)
// @route   GET /api/v1/cms
// @access  Admin
exports.getAllCMSItems = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  const query = type ? { type } : {};
  const items = await CMS.find(query).sort('type order').populate('updatedBy', 'fullName');
  successResponse(res, 'All CMS content fetched.', { items, total: items.length });
});

// @desc    Delete CMS item
// @route   DELETE /api/v1/cms/:key
// @access  Super Admin
exports.deleteCMSItem = catchAsync(async (req, res, next) => {
  const item = await CMS.findOneAndDelete({ key: req.params.key });
  if (!item) return next(new AppError('Content not found.', 404));
  successResponse(res, 'Content deleted.');
});

// @desc    Get homepage data (combined)
// @route   GET /api/v1/cms/homepage
// @access  Public
exports.getHomepageData = catchAsync(async (req, res, next) => {
  const [banners, stats, faqs, testimonials, sponsors] = await Promise.all([
    CMS.find({ type: 'banner', isActive: true }).sort('order').limit(5),
    CMS.find({ type: 'setting', key: { $regex: '^stat_' } }),
    CMS.find({ type: 'faq', isActive: true }).sort('order').limit(10),
    CMS.find({ type: 'testimonial', isActive: true }).sort('order').limit(6),
    CMS.find({ type: 'sponsor', isActive: true }).sort('order'),
  ]);

  successResponse(res, 'Homepage data fetched.', { banners, stats, faqs, testimonials, sponsors });
});
