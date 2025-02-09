// src/middleware/authMiddleware.js

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // Người dùng đã đăng nhập, tiếp tục xử lý
    } else {
        req.flash('error', 'Bạn cần đăng nhập để truy cập trang này!');
        return res.redirect('/auth/login'); // Chuyển hướng đến trang đăng nhập
    }
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next(); // Người dùng là admin, tiếp tục xử lý
    } else {
        req.flash('error', 'Bạn không có quyền truy cập trang này!');
        return res.redirect('/'); // Chuyển hướng đến trang chủ
    }
};

module.exports = {
    isAuthenticated,
    isAdmin,
};
