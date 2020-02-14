const Store = require("./models/store");
const mongoose = require("mongoose");
const processCSV = require("./services/processCSV");

const camelCaseify = string => {
  string = string.charAt(0).toLowerCase() + string.slice(1);
  return string.replace(/(\s.)/gm, g => g.toUpperCase()).replace(/\s/gm, '');
}

mongoose.connect(
  "mongodb://localhost:27017/ecom",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => console.log("connected to mongo db")
);
const db = mongoose.connection;

db.once("open", async () => {
  const { data, headers } = processCSV(process.argv[2], ',');
  let stores = [];
  data.forEach(store => {
    const storeObj = {};
    store.forEach((field, i) => {
      const header = headers[i] ? camelCaseify(headers[i]) : 'unknown';
      storeObj[header] = field.replace(/"/gm, '').trim();
    });
    stores.push(storeObj);
  });
  
  console.log(stores)
  stores.forEach(async store => {
    const newStore = new Store(store);
    console.log(newStore)
    await newStore.save();
    console.log(newStore)
  });
  process.exit();
});
