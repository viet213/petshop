'use strict';

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const globalDataMiddleware = require('./src/middleware/globalDataMiddleware');
const routes = require('./src/routes'); // Import file index.js trong routes
require('dotenv').config(); // Đọc cấu hình từ .env trước tiên
require('./config/passport'); // Đường dẫn tới file passport.js

const port = process.env.PORT || 3000;

// Kết nối tới cơ sở dữ liệu MongoDB
connectDB();

// Cấu hình session
app.use(
    session({
        secret: 'your-secret-key', // Thay thế bằng secret key của bạn
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600000 }, // Cookie hết hạn sau 1 giờ
    })
);

// Cấu hình passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.flash = req.flash(); // Truyền dữ liệu flash vào res.locals
    next();
});
// Middleware để xử lý dữ liệu từ client
app.use(express.json()); // Đọc dữ liệu dạng JSON
app.use(express.urlencoded({ extended: true })); // Đọc dữ liệu URL-encoded

// Cấu hình thư mục public cho static files (CSS, JS, images...)
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình view engine là EJS
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// Middleware toàn cục để truy cập các dữ liệu toàn cục
app.use(globalDataMiddleware);

// Sử dụng các route từ file index.js trong routes
app.use('/', routes);  // Sử dụng tất cả các routes đã đăng ký trong routes/index.js

// Middleware xử lý lỗi (404, 500)
app.use((req, res, next) => {
    res.status(404).send('Page not found!');
});

// Middleware xử lý lỗi bất kỳ (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
