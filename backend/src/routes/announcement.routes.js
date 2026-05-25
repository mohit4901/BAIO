const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement.controller');
const { protectAdmin, requirePermission } = require('../middlewares/auth.middleware');

// Public
router.get('/latest', announcementController.getLatestAnnouncements);
router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncement);

// Admin
router.post('/', protectAdmin, requirePermission('announcements'), announcementController.createAnnouncement);
router.patch('/:id', protectAdmin, requirePermission('announcements'), announcementController.updateAnnouncement);
router.delete('/:id', protectAdmin, requirePermission('announcements'), announcementController.deleteAnnouncement);

module.exports = router;
