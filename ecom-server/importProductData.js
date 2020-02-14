const Product = require("./models/product");
const Store = require("./models/store");
const mongoose = require("mongoose");
const processCSV = require("./services/processCSV");

const camelCaseify = string => {
  string = string.slice(0,3) !== 'SEO' ? string.charAt(0).toLowerCase() + string.slice(1) : string.slice(0,3).toLowerCase() + string.slice(3);
  return string.replace(/(\s.)/gm, g => g.toUpperCase()).replace(/\s/gm, '');
}

const numericalCategories = ['listPrice', 'price', 'weight', 'quantity', 'minQuantity', 'shippingFreight'];

mongoose.connect(
  "mongodb://localhost:27017/ecom",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => console.log("connected to mongo db")
);
const db = mongoose.connection;

db.once("open", async () => {
  const stores = await Store.find();
  const { data, headers } = processCSV(process.argv[2], /\t/g);
  let products = [];
  data.forEach(product => {
    const productObj = {};
    product.forEach((field, i) => {
      const header = headers[i] ? camelCaseify(headers[i]) : 'unknown';
      if (numericalCategories.find(cat => cat === header)) productObj[header] = Number(field.replace(/"/gm, '').trim());
      else productObj[header] = field.replace(/"/gm, '').trim();
    });
    productObj.productID = productObj.productId;
    productObj.categories = [`${productObj.store}:${productObj.category}`, ...productObj.secondaryCategories.split(';').map(c => c.trim())]
    productObj.totalInventory = productObj.quantity;
    productObj.availableStores = [(stores.find(s => s.name === productObj.store) || {}).storeID || ''];
    const existingProduct = products.find(p => p.productID === productObj.productID);
    if (existingProduct) _.merge(existingProduct, productObj);
    else products.push(productObj);
  });
  // TODO: aggregate duplicate `productCode`s to get an array of `availableStores`
  
  console.log(products)
  // products.forEach(product => new Product(product).save().then(s => console.log(s)))
  process.exit();
});
