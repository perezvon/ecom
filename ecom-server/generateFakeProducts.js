const Product = require("./models/product");
const Store = require("./models/store");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ecom", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.once("open", function() {
  console.log("connected to ecom db");
  Store.find()
    .exec()
    .then(stores => {
      const availableStores = stores.map(s => s.storeID);
      const products = [];
      for (let i = 0; i < 50; i++) {
        const name = Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "");
        const price = (Math.random() * 100).toFixed(2);
        const productID = name;
        const inventory = {
          S: Math.floor(Math.random() * 100) + 1,
          M: Math.floor(Math.random() * 100) + 1,
          L: Math.floor(Math.random() * 100) + 1
        };
        products.push({
          name,
          price,
          productID,
          inventory,
          availableStores
        });
      }
      products.forEach(product =>
        new Product(product).save().then(product => console.log(product))
      );
    });
});
