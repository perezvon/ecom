require("dotenv").config();
// importing the dependencies
const config = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const uuid = require("uuid/v4");

const logger = require("./services/logger");

mongoose.connect(
  "mongodb://localhost:27017/ecom",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => console.log("connected to mongo db")
);

// defining the Express app
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(logger());

app.use("/", router);

// starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});
