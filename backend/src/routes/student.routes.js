const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { protect, protectAdmin, restrictTo, requirePermission } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'src/uploads/temp/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

// Student self-service routes
router.get('/me', protect, studentController.getMyProfile);
router.patch('/me', protect, studentController.updateMyProfile);
router.post('/me/photo', protect, upload.single('photo'), studentController.uploadProfilePhoto);
router.post('/me/register-olympiad/:olympiadId', protect, studentController.registerForOlympiad);

// Admin routes
router.get('/stats', protectAdmin, requirePermission('students'), studentController.getStudentStats);
router.get('/', protectAdmin, requirePermission('students'), studentController.getAllStudents);
router.get('/:id', protect, studentController.getStudent);
router.patch('/:id', protectAdmin, requirePermission('students'), studentController.updateStudent);
router.delete('/:id', protectAdmin, restrictTo('super_admin'), studentController.deleteStudent);

module.exports = router;
