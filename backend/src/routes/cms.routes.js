const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cms.controller');
const { protectAdmin, requirePermission, restrictTo } = require('../middlewares/auth.middleware');

// Public
router.get('/homepage', cmsController.getHomepageData);
router.get('/type/:type', cmsController.getCMSByType);
router.get('/:key', cmsController.getCMSItem);

// Admin
router.get('/', protectAdmin, requirePermission('cms'), cmsController.getAllCMSItems);
router.put('/:key', protectAdmin, requirePermission('cms'), cmsController.upsertCMSItem);
router.delete('/:key', protectAdmin, restrictTo('super_admin'), cmsController.deleteCMSItem);

module.exports = router;
