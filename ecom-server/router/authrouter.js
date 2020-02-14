const express = require("express");
const passport = require("passport");
const crypto = require("crypto");
const authrouter = express.Router();
const Authentication = require("../controllers/authentication");
const passportService = require("../services/passport");
const Store = require("../models/store");
const emailService = require("../services/emailService");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

authrouter.post("/login", requireSignin, Authentication.signin);
authrouter.post("/register", Authentication.signup);

authrouter.post('/restoreSession', requireAuth, Authentication.signin);

authrouter.get("/logout", (req, res) => {
  res.send({});
});

authrouter.post("/reset-password", (req, res, next) => {
  if (req.body.email) {
    User.findOne({ email: req.body.email })
      .exec()
      .then(user => {
        if (user) {
          crypto.randomBytes(20, (err, buf) => {
            const token = buf.toString("hex");
            user.resetToken = token;
            user.resetExpires = Date.now() + 3600000; // 1 hour
            user.save().catch(err => next(err));
            emailService.send({
              template: "forgot-password",
              message: {
                to: process.env.NO_REPLY_ADDRESS,
                bcc: req.body.email
              },
              locals: {
                url: process.env.ROOT_URL,
                token
              }
            });
          });
        }
      });
  }
});

authrouter.get("/reset/:token", (req, res, next) => {
  User.findOne({
    resetToken: req.params.token,
    resetExpires: { $gt: Date.now() }
  })
    .exec()
    .then(user => {
      if (user) {
        res.json(user);
      } else res.json({ message: "Invalid or expired token." });
    })
    .catch(err => next(err));
});

authrouter.post("/reset/:token", (req, res, next) => {
  User.findOne({
    resetToken: req.params.token,
    resetExpires: { $gt: Date.now() }
  })
    .exec()
    .then(user => {
      if (user) {
        user.password = req.body.password;
        user.resetToken = null;
        user.resetExpires = null;
        user.save().then(user => res.json(user));
      } else res.json({ message: "Invalid or expired token." });
    })
    .catch(err => next(err));
});

module.exports = authrouter;
