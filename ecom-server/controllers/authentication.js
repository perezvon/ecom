const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");
const emailService = require("../services/emailService");


// function to clean user object
const userObjify = user => {
  const { username, firstName, lastName, wallet, stores, email, addresses, sizing, profile, role, metrics } = user;
  return { 
    username, firstName, lastName, wallet, stores, email, addresses, sizing, profile, role, metrics
  }
}

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  const { username, stores } = req.user;
  console.log(stores)
  User.findOne({ username: username })
    .exec()
    .then(user => {
      user.metrics.sessionCount = user.metrics.sessionCount + 1;
      user
        .save()
        .then(user => {
          res.json({
            ...userObjify(user),
            token: tokenForUser(req.user)
          });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

exports.signup = function(req, res, next) {
  console.log(req.body);
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide email and password" });
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User(req.body);

    user.save(function(err) {
      console.log("err>", err);
      if (err) {
        return next(err);
      }

      //send registration email
      emailService
        .send({
          template: "welcome",
          message: {
            to: email
          },
          locals: {
            name: `${user.firstName} ${user.lastName}`,
            username: username,
            url: process.env.ROOT_URL
          }
        })
        .then(console.log)
        .catch(console.error);

      // Repond to request indicating the user was created
      res.json({
        ...req.body,
        token: tokenForUser(user),
        isAuthenticated: true
      });
    });
  });
};
