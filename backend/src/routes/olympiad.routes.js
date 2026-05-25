const express = require('express');
const router = express.Router();
const olympiadController = require('../controllers/olympiad.controller');
const { protectAdmin, requirePermission, restrictTo } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({
  dest: 'src/uploads/temp/',
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Public routes
router.get('/featured', olympiadController.getFeaturedOlympiads);
router.get('/', olympiadController.getAllOlympiads);
router.get('/:slug', olympiadController.getOlympiad);

// Admin routes
router.post('/', protectAdmin, requirePermission('olympiads'), olympiadController.createOlympiad);
router.get('/admin/stats', protectAdmin, requirePermission('olympiads'), olympiadController.getOlympiadStats);
router.patch('/:id', protectAdmin, requirePermission('olympiads'), olympiadController.updateOlympiad);
router.delete('/:id', protectAdmin, restrictTo('super_admin'), olympiadController.deleteOlympiad);
router.post('/:id/banner', protectAdmin, requirePermission('olympiads'), upload.single('banner'), olympiadController.uploadBanner);
router.post('/:id/syllabus', protectAdmin, requirePermission('olympiads'), upload.single('syllabus'), olympiadController.uploadSyllabus);

module.exports = router;
