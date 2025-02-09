const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * Lấy dữ liệu chung cho tất cả các trang
 */
const getCommonData = async (req) => {
  try {
    const categories = await Category.find();
    const user = req.user || null;
    const cartItemCount = req.session.cart ? req.session.cart.length : 0;
    return { categories, user, cartItemCount };
  } catch (error) {
    console.error('Error fetching common data:', error);
    throw new Error('Unable to fetch common data');
  }
};

/**
 * Lấy danh sách sản phẩm nổi bật
 */
const getFeaturedProducts = async (limit = 6) => {
  try {
    return await Product.find().limit(limit);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Unable to fetch featured products');
  }
};

/**
 * Lấy danh sách sản phẩm theo điều kiện tìm kiếm
 */
const getProducts = async (searchCondition = {}) => {
  try {
    return await Product.find(searchCondition);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Unable to fetch products');
  }
};

/**
 * Lấy danh sách sản phẩm theo danh mục
 */
const getProductsByCategory = async (categoryId) => {
  try {
    return await Product.find({ category: categoryId });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Unable to fetch products by category');
  }
};

/**
 * Lấy thông tin chi tiết sản phẩm
 */
const getProductById = async (productId) => {
  try {
    return await Product.findById(productId);
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw new Error('Unable to fetch product details');
  }
};

module.exports = {
  getCommonData,
  getFeaturedProducts,
  getProducts,
  getProductsByCategory,
  getProductById,
};
