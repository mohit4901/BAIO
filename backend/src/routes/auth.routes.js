const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /auth/student/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new student
 */
router.post('/student/register', authLimiter, authController.registerStudent);
router.post('/student/login', authLimiter, authController.loginStudent);
router.post('/admin/login', authLimiter, authController.loginAdmin);
router.post('/logout', protect, authController.logout);
router.post('/refresh', authController.refreshTokens);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.patch('/reset-password/:token', authLimiter, authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/me', protect, authController.getMe);

module.exports = router;
