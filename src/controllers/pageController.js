// const Product = require('../models/Product');
// const Order = require('../models/Order');
// const Category = require('../models/Category');
// const User = require('../models/User');

// // Lấy các dữ liệu chung cho tất cả các trang (danh mục, người dùng, giỏ hàng)
// const getCommonData = async (req) => {
//   try {
//     const categories = await Category.find(); // Lấy danh sách danh mục
//     const user = req.user || null; // Kiểm tra người dùng đã đăng nhập chưa
//     const cartItemCount = req.session.cart ? req.session.cart.length : 0; // Kiểm tra số lượng sản phẩm trong giỏ hàng
//     return { categories, user, cartItemCount };
//   } catch (error) {
//     console.error('Error fetching common data:', error);
//     throw new Error('Unable to fetch common data');
//   }
// };

// const pageController = {
//   // Trang chủ
//   getHomePage: async (req, res) => {
//     try {
//       const { categories, user } = await getCommonData(req);
//       const products = await Product.find().limit(6); // Lấy 6 sản phẩm nổi bật
//       res.render('pages/home', { products, categories, user });
//     } catch (error) {
//       console.error('Error rendering home page:', error);
//       req.flash('error', 'Có lỗi xảy ra khi tải trang chủ.');
//       res.status(500).redirect('/'); // Redirect đến trang chủ với thông báo lỗi
//     }
//   },

//   // Trang sản phẩm
//   getProductsPage: async (req, res) => {
//     try {
//       const { categories, user, cartItemCount } = await getCommonData(req);
//       const query = req.query.query || '';
//       const searchCondition = query
//         ? { name: { $regex: query, $options: 'i' } } // Tìm kiếm sản phẩm theo tên
//         : {}; // Điều kiện tìm kiếm rỗng nếu không có query

//       const products = await Product.find(searchCondition);
//       res.render('pages/products', { products, categories, user, cartItemCount, query });
//     } catch (error) {
//       console.error('Error rendering products page:', error);
//       req.flash('error', 'Có lỗi xảy ra khi tải trang sản phẩm.');
//       res.status(500).redirect('/'); // Redirect đến trang chủ với thông báo lỗi
//     }
//   },

//   // Trang sản phẩm theo danh mục
//   getProductsByCategory: async (req, res) => {
//     try {
//       const { categories, user, cartItemCount } = await getCommonData(req);
//       const categoryId = req.params.categoryId;

//       // Kiểm tra xem danh mục có tồn tại không
//       const category = await Category.findById(categoryId);
//       if (!category) {
//         req.flash('error', 'Danh mục không tồn tại.');
//         return res.redirect('/'); // Nếu không có danh mục, chuyển hướng về trang chủ
//       }

//       const products = await Product.find({ category: categoryId });
//       res.render('pages/products', { products, categories, user, cartItemCount });
//     } catch (error) {
//       console.error('Error rendering products by category:', error);
//       req.flash('error', 'Có lỗi xảy ra khi tải sản phẩm theo danh mục.');
//       res.status(500).redirect('/'); // Redirect đến trang chủ với thông báo lỗi
//     }
//   },

//   // Chi tiết sản phẩm
//   getProductDetailPage: async (req, res) => {
//     try {
//       const { categories, user, cartItemCount } = await getCommonData(req);
//       const productId = req.params.id;
//       const product = await Product.findById(productId);

//       // Kiểm tra sản phẩm có tồn tại không
//       if (!product) {
//         req.flash('error', 'Sản phẩm không tồn tại.');
//         return res.redirect('/'); // Nếu không tìm thấy sản phẩm, chuyển hướng về trang chủ
//       }

//       res.render('pages/product-detail', { product, categories, user, cartItemCount });
//     } catch (error) {
//       console.error('Error rendering product detail page:', error);
//       req.flash('error', 'Có lỗi xảy ra khi tải chi tiết sản phẩm.');
//       res.status(500).redirect('/'); // Redirect đến trang chủ với thông báo lỗi
//     }
//   },
// };

// module.exports = pageController;

const pageService = require('../services/pageService');
const Category = require('../models/Category');

const pageController = {
  // Trang chủ
  getHomePage: async (req, res) => {
    try {
      const { categories, user } = await pageService.getCommonData(req);
      const products = await pageService.getFeaturedProducts();
      res.render('pages/home', { products, categories, user });
    } catch (error) {
      console.error('Error rendering home page:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải trang chủ.');
      res.status(500).redirect('/');
    }
  },

  // Trang sản phẩm
  getProductsPage: async (req, res) => {
    try {
      const { categories, user, cartItemCount } = await pageService.getCommonData(req);
      const query = req.query.query || '';
      const searchCondition = query
        ? { name: { $regex: query, $options: 'i' } }
        : {};

      const products = await pageService.getProducts(searchCondition);
      res.render('pages/products', { products, categories, user, cartItemCount, query });
    } catch (error) {
      console.error('Error rendering products page:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải trang sản phẩm.');
      res.status(500).redirect('/');
    }
  },

  // Trang sản phẩm theo danh mục
  getProductsByCategory: async (req, res) => {
    try {
      const { categories, user, cartItemCount } = await pageService.getCommonData(req);
      const categoryId = req.params.categoryId;

      const category = await Category.findById(categoryId);
      if (!category) {
        req.flash('error', 'Danh mục không tồn tại.');
        return res.redirect('/');
      }

      const products = await pageService.getProductsByCategory(categoryId);
      res.render('pages/products', { products, categories, user, cartItemCount });
    } catch (error) {
      console.error('Error rendering products by category:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải sản phẩm theo danh mục.');
      res.status(500).redirect('/');
    }
  },

  // Chi tiết sản phẩm
  getProductDetailPage: async (req, res) => {
    try {
      const { categories, user, cartItemCount } = await pageService.getCommonData(req);
      const productId = req.params.id;
      const product = await pageService.getProductById(productId);

      if (!product) {
        req.flash('error', 'Sản phẩm không tồn tại.');
        return res.redirect('/');
      }

      res.render('pages/product-detail', { product, categories, user, cartItemCount });
    } catch (error) {
      console.error('Error rendering product detail page:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải chi tiết sản phẩm.');
      res.status(500).redirect('/');
    }
  },
};

module.exports = pageController;
