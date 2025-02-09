// src/middleware/upload.js
const multer = require('multer');
const path = require('path');
// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Thư mục public/uploads để lưu file tải lên
        cb(null, path.join(__dirname, '../../public/uploads')); // Chỉ định thư mục lưu trữ
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên file là thời gian hiện tại + tên file gốc
    }
});

// Tạo instance multer với cấu hình
const upload = multer({ storage: storage });

module.exports = upload;
