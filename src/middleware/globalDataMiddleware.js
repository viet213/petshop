const Category = require('../models/Category');  // Import các models bạn cần

const globalDataMiddleware = async (req, res, next) => {
    try {
        // Kiểm tra và khởi tạo req.session.cart nếu nó chưa tồn tại
        if (!req.session.cart) {
            req.session.cart = [];  // Khởi tạo giỏ hàng rỗng nếu chưa có
        }

        // Fetch categories từ database chỉ khi cần thiết, tránh truy vấn không cần thiết
        const categories = await Category.find().sort({ createdAt: 1 });  // Sắp xếp theo createdAt hoặc theo yêu cầu

        // Lưu dữ liệu vào res.locals để sử dụng trong các view
        res.locals = {
            ...res.locals,  // Giữ lại các giá trị đã có trong res.locals
            categories,
            user: req.user || null,
            cartItemCount: req.session.cart.length,  // Đếm số lượng sản phẩm trong giỏ hàng
            error: req.flash('error') || '',  // Đảm bảo không phải là undefined
            success: req.flash('success') || '',  // Đảm bảo không phải là undefined
            query: req.query.query || "",  // Lấy query từ request (nếu có)
        };

        // Tạo thêm messages để sử dụng trong mọi view cho thông báo flash
        res.locals.messages = {
            error: req.flash('error'),
            success: req.flash('success'),
        };

        next();
    } catch (error) {
        console.error('Error fetching data for all views:', error);
        next(error);  // Pass the error to the next middleware for error handling
    }
};

module.exports = globalDataMiddleware;
