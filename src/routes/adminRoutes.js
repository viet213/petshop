const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Import middleware upload

// Trang dashboard admin
router.get('/admin-dashboard', isAuthenticated, isAdmin, (req, res) => {
  res.render('admin/admin-dashboard'); // Render trang admin dashboard
});
// Quản lý danh mục sản phẩm
router.get('/categories', isAuthenticated, isAdmin, adminController.getAllCategoriesView); // Danh sách danh mục
router.get('/categories/add', isAuthenticated, isAdmin, adminController.addCategoryView); // Thêm danh mục
router.post('/categories/add', isAuthenticated, isAdmin, adminController.addCategoryController); // Thêm danh mục
router.get('/categories/update/:id', isAuthenticated, isAdmin, adminController.updateCategoryView); // Sửa danh mục
router.post('/categories/update/:id', isAuthenticated, isAdmin, adminController.updateCategoryController); // Cập nhật danh mục
router.post('/categories/delete/:id', isAuthenticated, isAdmin, adminController.deleteCategoryController); // Xóa danh mục

// Quản lý sản phẩm
router.get('/products', isAuthenticated, isAdmin, adminController.getAllProductsView); // Danh sách sản phẩm
router.get('/products/add', isAuthenticated, isAdmin, adminController.addProductView); // Thêm sản phẩm
router.post('/products/add', isAuthenticated, isAdmin, upload.single('image'), adminController.addProductController); // Thêm sản phẩm với middleware multer
router.get('/products/update/:id', isAuthenticated, isAdmin, adminController.updateProductView); // Sửa sản phẩm
router.post('/products/update/:id', isAuthenticated, isAdmin,upload.single('image'), adminController.updateProductController); // Cập nhật sản phẩm
router.post('/products/delete/:id', isAuthenticated, isAdmin, adminController.deleteProductController); // Xóa sản phẩm

// Quản lý người dùng
router.get('/users', isAuthenticated, isAdmin, adminController.getAllUsersView); // Danh sách người dùng
router.get('/users/add', isAuthenticated, isAdmin, adminController.addUserView); // Thêm người dùng
router.post('/users/add', isAuthenticated, isAdmin, adminController.addUserController); // Thêm người dùng
router.get('/users/update/:id', isAuthenticated, isAdmin, adminController.updateUserView); // Sửa người dùng
router.post('/users/update/:id', isAuthenticated, isAdmin, adminController.updateUserController); // Cập nhật người dùng
router.post('/users/delete/:id', isAuthenticated, isAdmin, adminController.deleteUserController); // Xóa người dùng

// Quản lý đơn hàng
router.get('/orders', isAuthenticated, isAdmin, adminController.getAllOrdersView); // Danh sách đơn hàng
router.post('/orders/update/:id', isAuthenticated, isAdmin, adminController.updateOrderController); // Cập nhật trạng thái đơn hàng
router.post('/orders/delete/:id', isAuthenticated, isAdmin, adminController.deleteOrderController); // Xóa đơn hàng

// Route xem chi tiết đơn hàng
router.get('/orders/detail', isAuthenticated, isAdmin, adminController.getOrderDetailsView);

module.exports = router;
