const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Các route
router.get('/', pageController.getHomePage);
router.get('/products', pageController.getProductsPage);
router.get('/products/:id', pageController.getProductDetailPage);
router.get('/products/category/:categoryId', pageController.getProductsByCategory); // Route để xem sản phẩm theo danh mục
module.exports = router;
