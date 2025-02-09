// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// // Hàm kiểm tra mật khẩu
// const comparePasswords = async (plainPassword, hashedPassword) => {
//     try {
//         return await bcrypt.compare(plainPassword, hashedPassword);
//     } catch (error) {
//         throw new Error('Error comparing passwords');
//     }
// };

// // Hàm đăng ký người dùng mới
// const createUser = async (name, email, password) => {
//     try {
//         // Kiểm tra nếu email đã tồn tại trong cơ sở dữ liệu
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             throw new Error('Email already in use');
//         }

//         // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword
//         });

//         await newUser.save();
//         return newUser;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// // Hàm tìm người dùng theo email
// const findUserByEmail = async (email) => {
//     return await User.findOne({ email });
// };

// module.exports = {
//     comparePasswords,
//     createUser,
//     findUserByEmail
// };
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Tìm người dùng theo email
 * @param {String} email
 */
const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error('Lỗi khi tìm người dùng.');
    }
};

/**
 * Tạo người dùng mới
 * @param {Object} userData - { name, email, password, role }
 */
const createUser = async (userData) => {
    try {
        console.log('Dữ liệu trước khi tạo người dùng:', userData);  // In ra dữ liệu người dùng trước khi lưu

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword;  // Mật khẩu đã được mã hóa

        // Tạo người dùng mới và lưu vào MongoDB
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        console.log('Người dùng đã được lưu:', savedUser);  // In ra người dùng đã được lưu
        return savedUser;
    } catch (error) {
        console.error('Lỗi khi tạo người dùng:', error.message);  // In lỗi nếu có vấn đề
        throw new Error('Lỗi khi tạo người dùng');
    }
};

/**
 * Xác thực người dùng (đăng nhập)
 * @param {String} email
 * @param {String} password
 */
const authenticateUser = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    } catch (error) {
        throw new Error('Lỗi khi xác thực người dùng.');
    }
};

module.exports = {
    findUserByEmail,
    createUser,
    authenticateUser,
};
