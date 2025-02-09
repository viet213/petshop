// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  shippingAddress: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  recipientName: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped','Completed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  orderDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDetail' }]
});

module.exports = mongoose.model('Order', orderSchema);
