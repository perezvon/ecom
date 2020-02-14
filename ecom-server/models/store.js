const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  storeID: String,
  name: String,
  shippingMethods: [String],
  billingMethods: [String],
  lastModified: { type: Date, default: Date.now },
  hasManagerPortal: Boolean,
  managerPortal: {
    approval: Boolean,
    contactEmail: String
  },
  hasAllowance: Boolean,
  allowance: Number
});

module.exports = mongoose.model("Store", storeSchema);
