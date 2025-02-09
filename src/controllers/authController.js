const passport = require('passport');
const authService = require('../services/authService');

// Hiển thị trang đăng nhập
const getLogin = (req, res) => {
    res.render('pages/login', {
        message: res.locals.error.length > 0 ? res.locals.error[0] : null
    });
};

// Xử lý đăng nhập
const postLogin = passport.authenticate('local', {
    successRedirect: '/', // Chuyển hướng khi đăng nhập thành công
    failureRedirect: '/auth/login', // Chuyển hướng khi đăng nhập thất bại
    failureFlash: true, // Gửi thông báo lỗi qua flash
});

// Xử lý đăng xuất
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            req.flash('error', 'Đăng xuất không thành công.'); // Flash lỗi khi đăng xuất không thành công
            return res.redirect('/');
        }
        req.flash('success', 'Đăng xuất thành công.'); // Flash thành công khi đăng xuất
        res.redirect('/');
    });
};

// Hiển thị trang đăng ký
const getSignup = (req, res) => {
    const error = req.flash('error'); // Lấy thông báo lỗi từ flash
    const success = req.flash('success'); // Lấy thông báo thành công từ flash
    res.render('pages/signup', {
        error: error.length > 0 ? error[0] : null,
        success: success.length > 0 ? success[0] : null
    });
};

// Xử lý đăng ký
const postSignup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Kiểm tra tính hợp lệ của dữ liệu nhập vào
    if (!name || !email || !password || !confirmPassword) {
        req.flash('error', 'Vui lòng điền đầy đủ thông tin!');
        return res.redirect('/auth/signup');
    }

    if (password !== confirmPassword) {
        req.flash('error', 'Mật khẩu không khớp!');
        return res.redirect('/auth/signup');
    }

    try {
        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            req.flash('error', 'Email đã tồn tại!');
            return res.redirect('/auth/signup');
        }

        // Tạo người dùng mới
        await authService.createUser({ name, email, password, role: 'user' });
        req.flash('success', 'Đăng ký thành công! Hãy đăng nhập.');
        return res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Đã có lỗi xảy ra, vui lòng thử lại.');
        return res.redirect('/auth/signup');
    }
};


module.exports = {
    getLogin,
    postLogin,
    logout,
    getSignup,
    postSignup,
};
