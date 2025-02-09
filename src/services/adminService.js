// // src/services/userService.js
// const User = require('../models/User');
// const Product = require('../models/Product');
// const Category = require('../models/Category');
// const Order = require('../models/Order');

// // Lấy tất cả người dùng
// const getAllUsers = async () => {
//   return await User.find();
// };

// // Lấy người dùng theo ID
// const getUserById = async (id) => {
//   return await User.findById(id);
// };

// // Cập nhật thông tin người dùng
// const updateUser = async (id, updatedData) => {
//   return await User.findByIdAndUpdate(id, updatedData, { new: true });
// };

// // Xóa người dùng
// const deleteUser = async (id) => {
//   return await User.findByIdAndDelete(id);
// };


// // Lấy tất cả sản phẩm
// const getAllProducts = async () => {
//   return await Product.find().populate('category');
// };

// // Lấy sản phẩm theo ID
// const getProductById = async (id) => {
//   return await Product.findById(id).populate('category');
// };

// // Tạo sản phẩm mới
// const createProduct = async (newProduct) => {
//   const product = new Product(newProduct);
//   return await product.save();
// };

// // Cập nhật thông tin sản phẩm
// const updateProduct = async (id, updatedData) => {
//   return await Product.findByIdAndUpdate(id, updatedData, { new: true });
// };

// // Xóa sản phẩm
// const deleteProduct = async (id) => {
//   return await Product.findByIdAndDelete(id);
// };


// // Lấy tất cả danh mục
// const getAllCategories = async () => {
//   return await Category.find();
// };

// // Lấy danh mục theo ID
// const getCategoryById = async (id) => {
//   return await Category.findById(id);
// };

// // Tạo danh mục mới
// const createCategory = async (newCategory) => {
//   const category = new Category(newCategory);
//   return await category.save();
// };

// // Cập nhật thông tin danh mục
// const updateCategory = async (id, updatedData) => {
//   return await Category.findByIdAndUpdate(id, updatedData, { new: true });
// };

// // Xóa danh mục
// const deleteCategory = async (id) => {
//   return await Category.findByIdAndDelete(id);
// };


// // Lấy tất cả đơn hàng
// const getAllOrders = async () => {
//   return await Order.find().populate('user');
// };

// // Cập nhật trạng thái đơn hàng
// const updateOrderStatus = async (id, newStatus) => {
//   return await Order.findByIdAndUpdate(id, { status: newStatus }, { new: true });
// };

// module.exports = {
//   getAllOrders,
//   updateOrderStatus,
// };

// module.exports = {
//   getAllCategories,
//   getCategoryById,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// };

// module.exports = {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };

// module.exports = {
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
// };
// services/adminService.js

const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');

// Thêm danh mục sản phẩm
const addCategory = async (categoryData) => {
  try {
    const { name, description } = categoryData;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new Error('Danh mục đã tồn tại');
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    return { success: true, message: 'Danh mục sản phẩm đã được thêm' };
  } catch (error) {
    throw error;
  }
};

// Sửa thông tin danh mục sản phẩm
const updateCategoryById = async (categoryId, updateData) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
    return updatedCategory;
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    throw new Error('Không thể cập nhật danh mục');
  }
};

// Xóa danh mục sản phẩm (có xóa sản phẩm liên quan)
const deleteCategoryById = async (categoryId) => {
  try {
    // Xóa tất cả sản phẩm thuộc danh mục này
    await Product.deleteMany({ category: categoryId });
    await Category.findByIdAndDelete(categoryId);
    return { message: 'Danh mục và sản phẩm liên quan đã được xóa' };
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    throw new Error('Không thể xóa danh mục');
  }
};

// Thêm sản phẩm
const addProduct = async (productData) => {
  try {
    // Kiểm tra xem category có tồn tại trong DB không
    const categoryExists = await Category.findById(productData.category);
    if (!categoryExists) {
      throw new Error('Danh mục không tồn tại');
    }

    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    throw new Error(`Không thể thêm sản phẩm: ${error.message}`);
  }
};

// Sửa thông tin sản phẩm
const updateProductById = async (productId, updateData) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    return updatedProduct;
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    throw new Error('Không thể cập nhật sản phẩm');
  }
};

// Xóa sản phẩm
const deleteProductById = async (productId) => {
  try {
    await Product.findByIdAndDelete(productId);
    return { message: 'Sản phẩm đã được xóa' };
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    throw new Error('Không thể xóa sản phẩm');
  }
};

// Thêm người dùng
// Thêm người dùng
const addUser = async (userData) => {
  try {
    const { name, email, password, role, phone, address } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }

    const newUser = new User({ name, email, password, role, phone, address });
    await newUser.save();

    return { success: true, message: 'Người dùng đã được thêm thành công' };
  } catch (error) {
    throw error;
  }
};


// Sửa thông tin người dùng
const updateUserById = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return updatedUser;
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    throw new Error('Không thể cập nhật người dùng');
  }
};

// Xóa người dùng
const deleteUserById = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
    return { message: 'Người dùng đã được xóa' };
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    throw new Error('Không thể xóa người dùng');
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (orderId, newStatus) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // Nếu trạng thái cũ không phải "Cancelled" và trạng thái mới là "Cancelled"
  if (order.status !== 'Cancelled' && newStatus === 'Cancelled') {
    // Lấy danh sách chi tiết đơn hàng liên quan
    const orderDetails = await OrderDetail.find({ order: orderId });

    // Tăng lại số lượng sản phẩm trong kho
    for (const detail of orderDetails) {
      await Product.findByIdAndUpdate(
        detail.product,
        { $inc: { stock: detail.quantity } }
      );
    }
  }

  // Cập nhật trạng thái đơn hàng
  order.status = newStatus;
  await order.save();
  return order;
};

// Xóa đơn hàng
const deleteOrderById = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // Nếu đơn hàng chưa giao, trả lại số lượng sản phẩm
  if (order.status !== 'Shipped') {
    // Lấy danh sách chi tiết đơn hàng liên quan
    const orderDetails = await OrderDetail.find({ order: orderId });

    for (const detail of orderDetails) {
      await Product.findByIdAndUpdate(
        detail.product,
        { $inc: { stock: detail.quantity } }
      );
    }
  }

  // Xóa chi tiết đơn hàng trước
  await OrderDetail.deleteMany({ order: orderId });

  // Xóa đơn hàng
  await Order.findByIdAndDelete(orderId);
  return { message: 'Xóa đơn hàng thành công!' };
};



module.exports = {
  addCategory,
  updateCategoryById,
  deleteCategoryById,
  addProduct,
  updateProductById,
  deleteProductById,
  addUser,
  updateUserById,
  deleteUserById,
  updateOrderStatus,
  deleteOrderById,
};
