const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/school.controller');
const { protectAdmin, requirePermission, restrictTo } = require('../middlewares/auth.middleware');

// Public
router.post('/register', schoolController.registerSchool);

// Admin
router.get('/stats', protectAdmin, requirePermission('schools'), schoolController.getSchoolStats);
router.get('/', protectAdmin, requirePermission('schools'), schoolController.getAllSchools);
router.get('/:id', protectAdmin, requirePermission('schools'), schoolController.getSchool);
router.patch('/:id/verify', protectAdmin, requirePermission('schools'), schoolController.verifySchool);
router.patch('/:id', protectAdmin, requirePermission('schools'), schoolController.updateSchool);
router.delete('/:id', protectAdmin, restrictTo('super_admin'), schoolController.deleteSchool);

module.exports = router;
