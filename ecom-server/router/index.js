const express = require("express");
const passport = require("passport");
const router = express.Router();
const Store = require("../models/store");
const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const stripe = require("../services/stripe");
const authrouter = require("./authrouter");
const emailService = require("../services/emailService");
const aws = require("../controllers/aws");

const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/", async (req, res) => {
  res.send("not much here");
});

router.get("/user", requireAuth, (req, res) => {
  User.find()
    .exec()
    .then(users => {
      users.forEach(user => {
        delete user.password;
        delete user.role;
        delete user.permissions;
        delete user.resetToken;
        delete user.resetExpires;
      });
      res.send(users);
    });
});

router.put('/user/:id', requireAuth, async (req, res) => {
  console.log(req.body)
  // const user = await User.findOne({})
});

router.post('/user/new', requireAuth, async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
})

router.post('/user/new/batch', requireAuth, async (req, res) => {
  console.log(req.body)
  const [err, users] = await User.insertMany(req.body);
  res.send(users);
})

router.get("/stores", (req, res) => {
  Store.find()
    .exec()
    .then(stores => res.send(stores));
});

router.post("/stores/new", requireAuth, (req, res) => {
  Store.find()
    .exec()
    .then(stores => {
      const store = new Store({ ...req.body, storeID: stores.length + 2483 });
      store.save().then(store => res.send(store));
    });
});

router.post("/stores/:id", requireAuth, async (req, res) => {
  Store.findOneAndUpdate({ storeID: req.params.id }, req.body)
    .exec()
    .then(savedStore => res.send(savedStore));
});

router.get("/products", (req, res) => {
  Product.find()
    .exec()
    .then(products => res.send(products));
});

router.get("/products/:storeID", (req, res) => {
  const { storeID } = req.params;
  Product.find({ availableStores: storeID })
    .exec()
    .then(products => res.send(products));
});

router.post("/product/new", requireAuth, async (req, res) => {
  const products = await Product.find().exec();
  const product = new Product({
    ...req.body,
    productID: products.length + 34873497
  });
  product.save().then(prod => res.send(prod));
});

router.get("/product/:id", (req, res) => {
  Product.findOne({ productID: req.params.id })
    .exec()
    .then(product => res.send(product));
});

router.get("/orders", (req, res) => {
  Order.find()
    .exec()
    .then(orders => res.send(orders));
});

router.get("/orders/:storeID", (req, res) => {
  Order.find({ storeID: req.params.storeID })
    .exec()
    .then(orders => res.send(orders));
});

router.post("/orders/new", requireAuth, async (req, res) => {
  const store = await Store.findOne({ storeID: req.body.storeID }).exec();
  const orders = await Order.find().exec();
  const order = new Order({ ...req.body, orderID: orders.length + 1021 });
  if (store.managerPortal && store.managerPortal.approval) {
    order.status = "pending";
    await order.save();
    emailService
      .send({
        template: "new_order_approval",
        message: {
          to: store.managerPortal.contactEmail,
          cc: process.env.NO_REPLY_ADDRESS
        },
        locals: {
          orderTableHeaders: `<tr><td>Qty</td><td>Item</td><td>Size</td><td>Price</td></tr>`,
          orderDetails: order.items
            .map(
              item =>
                `<tr><td>${item.qty}</td><td>${item.name}</td><td>${item.size}</td><td>${item.price}</td></tr>`
            )
            .join(""),
          orderID: `#${order.orderID}`,
          storeName: store.name || order.storeID
        }
      })
      .then(console.log)
      .catch(console.error);
    res.send(order);
  } else {
    await order.save();
    stripe.createCharge({
      amount: +order.total * 100,
      currency: "usd",
      source: "tok_visa",
      receipt_email: "hi@hey.com"
    });
    console.log(store);
    emailService
      .send({
        template: "new_order",
        message: {
          to: `hi@hey.com`
        },
        locals: {
          orderTableHeaders: `<tr><td>Qty</td><td>Item</td><td>Size</td><td>Price</td></tr>`,
          orderDetails: order.items
            .map(
              item =>
                `<tr><td>${item.qty}</td><td>${item.name}</td><td>${item.size}</td><td>${item.price}</td></tr>`
            )
            .join(""),
          orderID: `#${order.orderID}`,
          storeName: store.name || order.storeID
        }
      })
      .then(console.log)
      .catch(console.error);

    res.send(order);
  }
});

router.post("/sign_s3", (req, res) => aws.sign_s3(req, res));

router.use("/auth", authrouter);

module.exports = router;
