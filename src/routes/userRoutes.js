// src/routes/userRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Giỏ hàng
router.get('/cart', isAuthenticated, userController.viewCart);
router.post('/cart/add', isAuthenticated, userController.addToCart);
router.post('/cart/remove', isAuthenticated, userController.removeFromCart);
router.post('/cart/update', isAuthenticated, userController.updateCartQuantity);

// Đặt hàng từ giỏ hàng
router.get('/order/cart/placeOrder', isAuthenticated, userController.placeOrderPage);
router.post('/order/cart/confirm', isAuthenticated, userController.placeOrder);


// Quản lý đơn hàng
router.get('/orders', isAuthenticated, userController.viewOrders);
router.get('/order/:orderId', isAuthenticated, userController.viewOrderDetail);
router.post('/order/:orderId/cancel', isAuthenticated, userController.cancelOrder);

// Đảm bảo người dùng đã đăng nhập trước khi vào các route này
router.get('/profile', isAuthenticated, userController.getProfile); // Hiển thị thông tin cá nhân
router.post('/profile/update', isAuthenticated, userController.updateProfile); // Cập nhật thông tin cá nhân
router.post('/profile/change-password', isAuthenticated, userController.changePassword); // Đổi mật khẩu

module.exports = router;
