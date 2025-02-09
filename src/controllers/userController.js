// src/controllers/userController.js
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Product = require('../models/Product');
const User = require('../models/User');
const {
    getCart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantityInCart,
    placeOrderService,
    cancelOrderService,
    viewOrdersService,
    viewOrderDetailService,
    getUserById,
    updateUser,
    changeUserPassword,
 } = require('../services/userService');
const bcrypt = require('bcryptjs');

// Hiển thị giỏ hàng
const viewCart = async (req, res) => {
    try {
        const cart = await getCart(req.user._id); // Gọi hàm getCart
        if (!cart || cart.items.length === 0) {
            req.flash('info', 'Giỏ hàng của bạn đang trống.');
            return res.render('user/cart', { cart });
        }
        res.render('user/cart', { cart });
    } catch (error) {
        req.flash('error', 'Lỗi khi lấy giỏ hàng.');
        console.error(error);
        res.redirect('/');
    }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        await addProductToCart(req.user._id, productId, quantity);
        req.flash('success', 'Sản phẩm đã được thêm vào giỏ hàng.');
        res.redirect('/user/cart');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/products/${productId}`);
    }
};

// Quản lý giỏ hàng: Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        await removeProductFromCart(req.user._id, productId);
        req.flash('success', 'Sản phẩm đã được xóa khỏi giỏ hàng.');
        res.redirect('/user/cart');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/user/cart');
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        await updateProductQuantityInCart(req.user._id, productId, quantity);
        req.flash('success', 'Số lượng sản phẩm trong giỏ hàng đã được cập nhật.');
        res.redirect('/user/cart');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/user/cart');
    }
};

// Trang xác nhận đặt hàng từ giỏ hàng
const placeOrderPage = async (req, res) => {
    try {
        console.log('User info:', req.user); // In ra thông tin người dùng
        const cart = await getCart(req.user._id);
        console.log('Cart:', cart); // In ra giỏ hàng để kiểm tra

        if (!cart || cart.items.length === 0) {
            req.flash('error', 'Giỏ hàng của bạn đang trống.');
            return res.redirect('/user/cart');
        }

        res.render('user/placeOrder', { cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        req.flash('error', 'Lỗi khi lấy thông tin giỏ hàng.');
        res.redirect('/user/cart');
    }
};


// Đặt hàng từ giỏ hàng
// const placeOrder = async (req, res) => {
//     const { shippingAddress, phoneNumber, recipientName } = req.body;

//     try {
//         const cart = await getCart(req.user._id);
//         if (!cart || cart.items.length === 0) {
//             req.flash('error', 'Giỏ hàng của bạn đang trống.');
//             return res.redirect('/user/cart');
//         }

//         const totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);

//         const newOrder = new Order({
//             user: req.user._id,
//             totalPrice,
//             paymentMethod: 'COD',
//             shippingAddress,
//             phoneNumber,
//             recipientName,
//             status: 'Pending',
//         });

//         await newOrder.save();

//         for (const item of cart.items) {
//             await OrderDetail.create({
//                 order: newOrder._id,
//                 product: item.product._id,
//                 quantity: item.quantity,
//                 price: item.product.price,
//             });
//         }

//         cart.items = [];
//         await cart.save();

//         req.flash('success', 'Đơn hàng của bạn đã được đặt thành công.');
//         res.redirect('/user/orders');
//     } catch (error) {
//         req.flash('error', 'Lỗi khi đặt hàng.');
//         res.redirect('/user/cart');
//     }
// };
const placeOrder = async (req, res) => {
    const { shippingAddress, phoneNumber, recipientName } = req.body;

    try {
        const result = await placeOrderService(req.user._id, shippingAddress, phoneNumber, recipientName);
        req.flash('success', 'Đơn hàng của bạn đã được đặt thành công.');
        res.redirect('/user/orders');
    } catch (error) {
        req.flash('error', error.message || 'Lỗi khi đặt hàng.');
        res.redirect('/user/cart');
    }
};




// Xem tất cả đơn hàng của người dùng
const viewOrders = async (req, res) => {
    try {
        const orders = await viewOrdersService(req.user._id);
        res.render('user/orders', { orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        req.flash('error', 'Lỗi khi lấy đơn hàng.');
        res.redirect('/');
    }
};

// Xem chi tiết đơn hàng
const viewOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const { order, orderDetails } = await viewOrderDetailService(orderId, userId);

        // Log dữ liệu trả về để kiểm tra
        console.log('Order:', order);
        console.log('Order Details:', orderDetails);

        res.render('user/orderDetail', { order, orderDetails });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Lỗi khi lấy thông tin chi tiết đơn hàng.');
    }
};
// Hủy đơn hàng nếu trạng thái là Pending
// const cancelOrder = async (req, res) => {
//     const { orderId } = req.params;
//     try {
//         const order = await Order.findById(orderId);
//         if (!order) {
//             req.flash('error', 'Đơn hàng không tồn tại.');
//             return res.redirect('/user/orders');
//         }
//         if (order.status === 'Pending') {
//             order.status = 'Cancelled';
//             await order.save();
//             req.flash('success', 'Đơn hàng đã bị hủy.');
//         } else {
//             req.flash('error', 'Bạn không thể hủy đơn hàng này vì nó đã được xử lý.');
//         }
//         res.redirect('/user/orders');
//     } catch (error) {
//         req.flash('error', 'Lỗi khi hủy đơn hàng.');
//         res.redirect('/user/orders');
//     }
// };
// Hủy đơn hàng nếu trạng thái là Pending
const cancelOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        await cancelOrderService(orderId);
        req.flash('success', 'Đơn hàng đã bị hủy.');
        res.redirect('/user/orders');
    } catch (error) {
        req.flash('error', error.message || 'Lỗi khi hủy đơn hàng.');
        res.redirect('/user/orders');
    }
};

// // Hàm xem thông tin profile của người dùng
// const getProfile = async (req, res) => {
//     try {
//         // Tìm thông tin người dùng từ cơ sở dữ liệu
//         const user = await User.findById(req.user._id);
//         if (!user) {
//             req.flash('error', 'Người dùng không tồn tại.');
//             return res.redirect('/');
//         }

//         // Render trang profile với thông tin người dùng
//         res.render('user/profile', { user });
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Lỗi khi tải thông tin profile.');
//         res.redirect('/');
//     }
// };

// // Hàm cập nhật thông tin profile
// const updateProfile = async (req, res) => {
//     const { name, email, phone, address } = req.body;

//     try {
//         // Cập nhật thông tin người dùng trong cơ sở dữ liệu
//         const user = await User.findById(req.user._id);
//         if (!user) {
//             req.flash('error', 'Người dùng không tồn tại.');
//             return res.redirect('/');
//         }

//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.phone = phone || user.phone;
//         user.address = address || user.address;

//         await user.save();

//         req.flash('success', 'Cập nhật thông tin thành công.');
//         res.redirect('/user/profile');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Lỗi khi cập nhật thông tin.');
//         res.redirect('/user/profile');
//     }
// };

// // Hàm đổi mật khẩu
// const changePassword = async (req, res) => {
//     const { oldPassword, newPassword, confirmPassword } = req.body;

//     try {
//         // Kiểm tra mật khẩu cũ
//         const user = await User.findById(req.user._id);
//         if (!user) {
//             req.flash('error', 'Người dùng không tồn tại.');
//             return res.redirect('/');
//         }

//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//             req.flash('error', 'Mật khẩu cũ không đúng.');
//             return res.redirect('/user/profile');
//         }

//         // Kiểm tra mật khẩu mới và xác nhận mật khẩu
//         if (newPassword !== confirmPassword) {
//             req.flash('error', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
//             return res.redirect('/user/profile');
//         }

//         // Mã hóa mật khẩu mới và cập nhật
//         user.password = await bcrypt.hash(newPassword, 10);
//         await user.save();

//         req.flash('success', 'Đổi mật khẩu thành công.');
//         res.redirect('/user/profile');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Lỗi khi đổi mật khẩu.');
//         res.redirect('/user/profile');
//     }
// };

// Lấy thông tin profile
const getProfile = async (req, res) => {
    try {
      const user = await getUserById(req.user._id); // Gọi hàm từ userService
      if (!user) {
        req.flash('error', 'Người dùng không tồn tại.');
        return res.redirect('/');
      }
      res.render('user/profile', { user });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Lỗi khi tải thông tin profile.');
      res.redirect('/');
    }
  };
  
  // Cập nhật thông tin profile
  const updateProfile = async (req, res) => {
    const { name, email, phone, address } = req.body;
  
    try {
      await updateUser(req.user._id, { name, email, phone, address }); // Gọi hàm từ userService
      req.flash('success', 'Cập nhật thông tin thành công.');
      res.redirect('/user/profile');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Lỗi khi cập nhật thông tin.');
      res.redirect('/user/profile');
    }
  };
  
  // Đổi mật khẩu
  const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
  
    try {
      // Kiểm tra mật khẩu mới và xác nhận mật khẩu
      if (newPassword !== confirmPassword) {
        req.flash('error', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
        return res.redirect('/user/profile');
      }
  
      await changeUserPassword(req.user._id, oldPassword, newPassword); // Gọi hàm từ userService
      req.flash('success', 'Đổi mật khẩu thành công.');
      res.redirect('/user/profile');
    } catch (error) {
      console.error(error);
  
      // Xử lý lỗi cụ thể
      if (error.message === 'Incorrect old password') {
        req.flash('error', 'Mật khẩu cũ không đúng.');
      } else {
        req.flash('error', 'Lỗi khi đổi mật khẩu.');
      }
      res.redirect('/user/profile');
    }
  };

module.exports = {
    viewCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    placeOrderPage,
    placeOrder,
    viewOrders,
    viewOrderDetail,
    cancelOrder,
    getProfile,
    updateProfile,
    changePassword
};
