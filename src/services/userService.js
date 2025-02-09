// src/services/userService.js
// src/services/userService.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Lấy giỏ hàng của người dùng
const getCart = async (userId) => {
    try {
        console.log('Fetching cart for user:', userId);  // In ra userId đang tìm giỏ hàng
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        console.log('Cart found:', cart);  // In ra giỏ hàng tìm thấy

        if (!cart) {
            console.log('No cart found, creating a new cart for user');
            // Tạo giỏ hàng mới nếu chưa tồn tại
            return await Cart.create({ user: userId, items: [] });
        }

        return cart;
    } catch (error) {
        console.error('Error fetching cart:', error);  // In ra lỗi nếu có
        throw new Error('Lỗi khi lấy giỏ hàng');
    }
};

const addProductToCart = async (userId, productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Sản phẩm không tồn tại.');

    if (product.stock < quantity) {
        throw new Error(`Số lượng yêu cầu (${quantity}) vượt quá tồn kho (${product.stock}).`);
    }

    let cart = await getCart(userId);
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId.toString());
    if (itemIndex >= 0) {
        const newQuantity = cart.items[itemIndex].quantity + parseInt(quantity, 10);
        if (newQuantity > product.stock) {
            throw new Error(`Số lượng trong giỏ hàng (${newQuantity}) vượt quá tồn kho (${product.stock}).`);
        }
        cart.items[itemIndex].quantity = newQuantity;
    } else {
        cart.items.push({ product: productId, quantity: parseInt(quantity, 10) });
    }

    await cart.save();
    return cart;
};

const removeProductFromCart = async (userId, productId) => {
    const cart = await getCart(userId);
    if (!cart || cart.items.length === 0) {
        throw new Error('Giỏ hàng không tồn tại hoặc trống.');
    }

    cart.items = cart.items.filter(item => item.product._id.toString() !== productId.toString());
    await cart.save();
    return cart;
};

const updateProductQuantityInCart = async (userId, productId, quantity) => {
    const cart = await getCart(userId);
    if (!cart || cart.items.length === 0) {
        throw new Error('Giỏ hàng không tồn tại hoặc trống.');
    }

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId.toString());
    if (itemIndex >= 0) {
        const product = await Product.findById(productId);
        if (!product) throw new Error('Sản phẩm không tồn tại.');

        if (product.stock < quantity) {
            throw new Error(`Số lượng yêu cầu (${quantity}) vượt quá tồn kho.`);
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return cart;
    } else {
        throw new Error('Sản phẩm không có trong giỏ hàng.');
    }
};

// Đặt hàng từ giỏ hàng
const placeOrderService = async (userId, shippingAddress, phoneNumber, recipientName) => {
    const cart = await getCart(userId);

    if (!cart || cart.items.length === 0) {
        throw new Error('Giỏ hàng của bạn đang trống.');
    }

    const totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);

    const newOrder = new Order({
        user: userId,
        totalPrice,
        paymentMethod: 'COD',
        shippingAddress,
        phoneNumber,
        recipientName,
        status: 'Pending',
    });

    await newOrder.save();

    for (const item of cart.items) {
        const product = await Product.findById(item.product._id).populate('category'); 
        if (product) {
            // Trừ số lượng tồn kho
            product.stock -= item.quantity;
            await product.save();
        }

        // Thêm vào OrderDetail với thông tin sản phẩm "snapshot"
        await OrderDetail.create({
            order: newOrder._id,
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            productSnapshot: {
                name: item.product.name,
                category: product.category ? product.category.name : 'Chưa xác định',  // Lưu tên danh mục từ bảng category
            },
        });
    }

    // Dọn sạch giỏ hàng
    cart.items = [];
    await cart.save();

    return newOrder;
};
// đang làm tơis đặt hàng từ giỏ hàng tiếp đến là  hủy đơn hàng
// Hủy đơn hàng
const cancelOrderService = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error('Đơn hàng không tồn tại.');
    }

    if (order.status === 'Pending') {
        const orderDetails = await OrderDetail.find({ order: order._id });

        for (const detail of orderDetails) {
            const product = await Product.findById(detail.product._id);
            if (product) {
                product.stock += detail.quantity;
                await product.save();
            }
        }

        order.status = 'Cancelled';
        await order.save();
    } else {
        throw new Error('Bạn không thể hủy đơn hàng này vì nó đã được xử lý.');
    }
};

// Xem tất cả đơn hàng của người dùng
const viewOrdersService = async (userId) => {
    const orders = await Order.find({ user: userId });
    return await Promise.all(
        orders.map(async (order) => {
            const orderDetails = await OrderDetail.find({ order: order._id }).populate('product');
            return { ...order.toObject(), details: orderDetails };
        })
    );
};

// Xem chi tiết đơn hàng
const viewOrderDetailService = async (orderId, userId) => {
    const order = await Order.findById(orderId);

    if (!order || order.user.toString() !== userId.toString()) {
        throw new Error('Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.');
    }

    const orderDetails = await OrderDetail.find({ order: orderId }).populate('product');
    return { order, orderDetails };
};

/**
 * Lấy thông tin người dùng từ cơ sở dữ liệu
 */
const getUserById = async (userId) => {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Unable to fetch user');
    }
  };
  
  /**
   * Cập nhật thông tin người dùng
   */
  const updateUser = async (userId, updateData) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
  
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) user[key] = updateData[key];
      });
  
      await user.save();
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Unable to update user');
    }
  };
  
  /**
   * Đổi mật khẩu người dùng
   */
  const changeUserPassword = async (userId, oldPassword, newPassword) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new Error('Incorrect old password');
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

module.exports = {
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
};
