const express = require('express');

// Import các routes
const pageRoutes = require('./pageRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');

// Nếu có thêm các routes khác, import ở đây
// const userRoutes = require('./userRoutes');
// const productRoutes = require('./productRoutes');

const router = express.Router();

// Sử dụng các routes
router.use('/', pageRoutes);
router.use('/auth', authRoutes); // Đặt các routes liên quan đến auth
router.use('/admin', adminRoutes);
router.use('/user', userRoutes);

module.exports = router;
