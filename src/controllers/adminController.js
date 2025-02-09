const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
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
} = require('../services/adminService');

// Hiển thị trang danh sách danh mục sản phẩm
const getAllCategoriesView = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    
    // Sắp xếp danh mục theo thời gian tạo (createdAt)
    const categories = await Category.find({
      name: { $regex: searchQuery, $options: 'i' }
    }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian tạo (1 là tăng dần, -1 là giảm dần)

    res.render('admin/categories', { categories, searchQuery });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi tải danh sách danh mục');
    res.redirect('/admin/categories'); // Thêm thông báo lỗi
  }
};

// Hiển thị trang thêm danh mục
const addCategoryView = (req, res) => {
    res.render('admin/addCategory');
  };

// Hiển thị trang chỉnh sửa danh mục
const updateCategoryView = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Danh mục không tồn tại');
      return res.redirect('/admin/categories');
    }

    res.render('admin/updateCategory', { category });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi tải thông tin danh mục');
    res.redirect('/admin/categories');
  }
};

// Hiển thị trang danh sách sản phẩm
const getAllProductsView = async (req, res) => {
  try {
    const searchQuery = req.query.search || ''; // Lấy giá trị tìm kiếm từ thanh tìm kiếm
    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } }, // Tìm theo tên sản phẩm
        { 'category.name': { $regex: searchQuery, $options: 'i' } } // Tìm theo tên danh mục
      ]
    }).populate('category'); // populate để lấy thông tin danh mục
    res.render('admin/products', { products, searchQuery });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải danh sách sản phẩm');
  }
};

// Hiển thị trang thêm sản phẩm
const addProductView = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('admin/addProduct', { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải danh sách danh mục');
  }
};

// Hiển thị trang chỉnh sửa sản phẩm
const updateProductView = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    const categories = await Category.find();
    if (!product) {
      return res.status(404).send('Sản phẩm không tồn tại');
    }
    res.render('admin/updateProduct', { product, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải thông tin sản phẩm');
  }
};

// Hiển thị trang danh sách người dùng
const getAllUsersView = async (req, res) => {
  try {
    const searchTerm = req.query.search || ''; // Lấy giá trị từ thanh tìm kiếm
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } }, // Tìm theo tên
        { email: { $regex: searchTerm, $options: 'i' } }, // Tìm theo email
        { phone: { $regex: searchTerm, $options: 'i' } }, // Tìm theo số điện thoại
        { role: { $regex: searchTerm, $options: 'i' } }  // Tìm theo vai trò
      ]
    });
    res.render('admin/users', { users, searchTerm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải danh sách người dùng');
  }
};

//hiển thị trang thêm người dùng
const addUserView = async (req, res) => {
    try {
      res.render('admin/addUser', {
        success: req.flash('success'),
        error: req.flash('error'),
      });
    } catch (error) {
      console.error('Lỗi khi tải trang thêm người dùng:', error);
      req.flash('error', 'Đã xảy ra lỗi khi tải trang thêm người dùng');
      res.redirect('/admin/users'); // Chuyển hướng về danh sách người dùng trong trường hợp lỗi
    }
  };
  
// Hiển thị trang chỉnh sửa người dùng
const updateUserView = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('Người dùng không tồn tại');
    }
    res.render('admin/updateUser', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải thông tin người dùng');
  }
};

// Hiển thị trang danh sách đơn hàng
const getAllOrdersView = async (req, res) => {
  try {
    const searchQuery = req.query.search || ''; // Lấy giá trị từ thanh tìm kiếm

    // Tạo điều kiện tìm kiếm cho đơn hàng
    const query = {
      $or: [
        { status: { $regex: searchQuery, $options: 'i' } }, // Tìm theo trạng thái
        { recipientName: { $regex: searchQuery, $options: 'i' } } // Tìm theo tên người đặt
      ]
    };

    // Tìm tất cả đơn hàng theo điều kiện tìm kiếm, không lấy chi tiết sản phẩm
    const orders = await Order.find(query)
      .populate('user', 'name email') // Lấy thông tin người dùng
      .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo đơn hàng (mới nhất trước)

    // Render trang orders với dữ liệu tìm được
    res.render('admin/orders', { orders, searchQuery });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải danh sách đơn hàng');
  }
};

//hiển thị chi tiết đơn hàng
const getOrderDetailsView = async (req, res) => {
  try {
    const orderId = req.query.orderId;  // Lấy orderId từ query
    if (!orderId) {
      req.flash('error', 'Không tìm thấy ID đơn hàng.');
      return res.redirect('/admin/orders');
    }

    const order = await Order.findById(orderId).populate('user', 'name email phoneNumber');

    if (!order) {
      req.flash('error', 'Đơn hàng không tồn tại.');
      return res.redirect('/admin/orders');
    }

    const orderDetails = await OrderDetail.find({ order: orderId })
        .populate({
            path: 'product',
            select: 'name price category',
            populate: { path: 'category', select: 'name' }
        });

    res.render('admin/orderDetail', { order, orderDetails });
  } catch (error) {
    console.error('Error fetching admin order details:', error);
    req.flash('error', 'Lỗi khi lấy chi tiết đơn hàng.');
    res.redirect('/admin/orders');
  }
};

// Thêm danh mục sản phẩm
const addCategoryController = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await addCategory({ name, description });
    req.flash('success', result.message);
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    req.flash('error', error.message || 'Lỗi khi thêm danh mục sản phẩm');
    res.redirect('/admin/categories/add');
  }
};

// Sửa thông tin danh mục sản phẩm
const updateCategoryController = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    const updatedCategory = await updateCategoryById(categoryId, { name, description });
    if (!updatedCategory) {
      req.flash('error', 'Danh mục không tồn tại');
      return res.redirect(`/admin/categories/update/${categoryId}`);
    }

    req.flash('success', 'Danh mục sản phẩm đã được cập nhật');
    res.redirect(`/admin/categories/update/${categoryId}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi cập nhật danh mục sản phẩm');
    res.redirect(`/admin/categories/update/${categoryId}`);
  }
};

// Xóa danh mục sản phẩm
const deleteCategoryController = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const result = await deleteCategoryById(categoryId);

    req.flash('success', result.message);
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    req.flash('error', 'Không thể xóa danh mục');
    res.redirect('/admin/categories');
  }
};

// Thêm sản phẩm
const addProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!category) {
      req.flash('error', 'Danh mục không được để trống');
      return res.redirect('/admin/products/add');
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      req.flash('error', 'Danh mục không tồn tại');
      return res.redirect('/admin/products/add');
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }

    const newProduct = await addProduct({ name, description, price, stock, category, imageUrl });

    req.flash('success', 'Sản phẩm đã được thêm thành công');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    req.flash('error', 'Lỗi khi thêm sản phẩm');
    res.redirect('/admin/products/add');
  }
};

// Sửa thông tin sản phẩm
const updateProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock, category, imageUrl } = req.body;

    const updatedProduct = await updateProductById(productId, { name, description, price, stock, category, imageUrl });
    if (!updatedProduct) {
      req.flash('error', 'Sản phẩm không tồn tại');
      return res.redirect(`/admin/products/update/${productId}`);
    }

    req.flash('success', 'Sản phẩm đã được cập nhật thành công');
    res.redirect(`/admin/products`);
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật sản phẩm');
    res.redirect(`/admin/products/update/${productId}`);
  }
};

// Xóa sản phẩm
const deleteProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await deleteProductById(productId);

    req.flash('success', result.message);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    req.flash('error', 'Không thể xóa sản phẩm');
    res.redirect('/admin/products');
  }
};

// Thêm người dùng
const addUserController = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    const result = await addUser({ name, email, password, role, phone, address });
    req.flash('success', result.message);
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Lỗi khi thêm người dùng:', error);
    req.flash('error', error.message || 'Đã xảy ra lỗi khi thêm người dùng');
    res.redirect('/admin/users/add');
  }
};

// Sửa thông tin người dùng
const updateUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, password, phone, address } = req.body;

    // Tạo đối tượng cập nhật dữ liệu
    const updatedData = { name, email, role, phone, address };

    // Nếu có mật khẩu mới, mã hóa và cập nhật
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu
      updatedData.password = hashedPassword; // Thêm mật khẩu đã mã hóa vào đối tượng cập nhật
    }

    // Cập nhật thông tin người dùng trong database
    const updatedUser = await updateUserById(userId, updatedData);
    if (!updatedUser) {
      req.flash('error', 'Người dùng không tồn tại');
      return res.redirect('/admin/users');
    }

    req.flash('success', 'Thông tin người dùng đã được cập nhật');
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    req.flash('error', 'Đã xảy ra lỗi khi cập nhật người dùng');
    res.redirect('/admin/users');
  }
};

// Xóa người dùng
const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await deleteUserById(userId);
    if (!deletedUser) {
      req.flash('error', 'Người dùng không tồn tại');
      return res.redirect('/admin/users');
    }

    req.flash('success', 'Người dùng đã được xóa thành công');
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    req.flash('error', 'Đã xảy ra lỗi khi xóa người dùng');
    res.redirect('/admin/users');
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy orderId từ params
    const { status } = req.body; // Lấy status từ body
    console.log('Order ID:', id); // Debug

    if (!id || !status) {
      return res.status(400).json({ message: 'Missing orderId or status' });
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await updateOrderStatus(id, status);

    // Đưa thông báo thành công vào flash message
    req.flash('success', 'Cập nhật trạng thái đơn hàng thành công');

    // Redirect về trang admin/orders
    res.redirect('/admin/orders');
  } catch (error) {
    console.error('Error updating order status:', error);

    // Đưa thông báo lỗi vào flash message
    req.flash('error', 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');

    // Redirect về trang admin/orders
    res.redirect('/admin/orders');
  }
};

// Xóa đơn hàng
const deleteOrderController = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await deleteOrderById(orderId);

    req.flash('success', result.message);
    res.redirect('/admin/orders');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi xóa đơn hàng');
    res.redirect('/admin/orders');
  }
};

module.exports = {
    getAllCategoriesView,
    addCategoryView,
    updateCategoryView,
    getAllProductsView,
    addProductView,
    updateProductView,
    getAllUsersView,
    addUserView,
    updateUserView,
    getAllOrdersView,
    addCategoryController,
    updateCategoryController,
    deleteCategoryController,
    addProductController,
    updateProductController,
    deleteProductController,
    addUserController,
    updateUserController,
    deleteUserController,
    updateOrderController,
    deleteOrderController,
    getOrderDetailsView
  };