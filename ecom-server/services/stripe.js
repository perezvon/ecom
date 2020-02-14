// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")("sk_test_ZHYTBuq9jrLjJ48MfOb5yeIM");

const testCharge = async () => {
  const charge = await stripe.charges.create({
    amount: 1000,
    currency: "usd",
    source: "tok_visa",
    receipt_email: "jenny.rosen@example.com"
  });
  console.log(charge);
};

const createCharge = async data => {
  const charge = await stripe.charges.create(data);
  return charge;
};

module.exports = { testCharge, createCharge };
