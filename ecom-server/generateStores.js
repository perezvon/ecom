const Store = require('./models/store')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecom', { useNewUrlParser: true, useUnifiedTopology: true }, err => console.log('connected to mongo db'));
const db = mongoose.connection;

db.once('open', function() {
  const stores = [{
    storeID: '123456',
    name: 'Hennepin EMS',
    shippingMethods: ['Spee-Dee', 'Pick up at store'],
    billingMethods: ['Charge to Department', 'COD'],
  }, {
    storeID: '234985u3o',
    name: 'Rondo Bondo',
    shippingMethods: ['Spee-Dee', 'Pick up at store'],
    billingMethods: ['Charge to Department', 'COD'],
  }];

  stores.forEach(store => new Store(store).save().then(s => console.log(s)))
});
