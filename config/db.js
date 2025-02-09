const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Tải các biến môi trường từ file .env
dotenv.config();

// Lấy chuỗi kết nối MongoDB từ biến môi trường
const urlConnect = process.env.DB;

const connectDB = () => {
  mongoose
    .connect(urlConnect) // Loại bỏ các tùy chọn không cần thiết
    .then(() => {
      console.log('Connect successfully to MongoDB!');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
      process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    });
};

module.exports = connectDB;