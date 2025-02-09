const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Đảm bảo đường dẫn chính xác
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); // Đảm bảo đường dẫn chính xác
// Route đăng ký
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// Route đăng nhập
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Route đăng xuất
router.get('/logout', authController.logout);

// Các route yêu cầu người dùng phải đăng nhập
//router.get('/profile', isAuthenticated, authController.getProfile);


module.exports = router;
