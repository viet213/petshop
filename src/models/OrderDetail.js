// models/OrderDetail.js
const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  productSnapshot: {
    name: { type: String, required: true },
    category: { type: String }, // Lưu danh mục dưới dạng chuỗi (nếu cần)
  },
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);
