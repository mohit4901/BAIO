const express = require('express');
const router = express.Router();
const resultController = require('../controllers/result.controller');
const { protectAdmin, requirePermission } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'src/uploads/temp/', limits: { fileSize: 10 * 1024 * 1024 } });

// Public
router.get('/search', resultController.searchResult);

// Admin
router.get('/', protectAdmin, requirePermission('results'), resultController.getAllResults);
router.post('/', protectAdmin, requirePermission('results'), resultController.createResult);
router.post('/bulk-upload', protectAdmin, requirePermission('results'), upload.single('csv'), resultController.bulkUploadResults);
router.patch('/publish/:olympiadId', protectAdmin, requirePermission('results'), resultController.publishResults);

module.exports = router;
