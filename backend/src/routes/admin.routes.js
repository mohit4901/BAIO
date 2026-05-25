const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protectAdmin, restrictTo, requirePermission } = require('../middlewares/auth.middleware');

router.use(protectAdmin);

router.get('/stats', requirePermission('analytics'), adminController.getDashboardStats);
router.get('/', restrictTo('super_admin'), adminController.getAllAdmins);
router.post('/', restrictTo('super_admin'), adminController.createAdmin);
router.get('/:id', restrictTo('super_admin'), adminController.getAdmin);
router.patch('/:id', restrictTo('super_admin'), adminController.updateAdmin);
router.delete('/:id', restrictTo('super_admin'), adminController.deleteAdmin);

module.exports = router;
