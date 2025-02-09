// models/index.js

const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const Cart = require('./Cart');

module.exports = {
  User,
  Product,
  Category,
  Order,
  OrderDetail,
  Cart
};
