const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  storeID: String,
  orderID: Number,
  status: String,
  user: {
    name: String,
    userID: String,
  },
  items: [
    {
      productID: String,
      sku: String,
      name: String,
      size: String,
      qty: String,
      price: Number,
    },
  ],
  shippingAddress: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
  },
  billingAddress: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
  },
  paymentMethod: {
    wallet: Number,
    cc: {
      lastFour: Number,
      amount: Number,
    },
  },
  shippingMethod: String,
  billingMethod: String,
  orderDate: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  total: String,
});

module.exports = mongoose.model('Order', orderSchema);
