const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productID: String,
  name: String,
  baseSKU: String,
  description: String,
  price: Number,
  listPrice: Number,
  status: Number, 
  images: [String],
  inventory: { S: Number, M: Number, L: Number },
  totalInventory: Number,
  availableStores: [String],
  lastModified: { type: Date, default: Date.now },
  categories: [String]
});

module.exports = mongoose.model("Product", productSchema);
