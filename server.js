const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();

let port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let mongoOptions = {
  useNewUrlParser: true,
  dbName: "task",
  autoIndex: false,
  useUnifiedTopology: true,
};
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, mongoOptions)
  .then(() => console.log("MongoDB connected Successfully"))
  .catch((err) => console.log("Error:", err));

var secret = process.env.SECRET_KEY;
app.set("secretKey", secret);

app.use(morgan("dev"));

const routes = require("./routes/route");
app.use("/api", routes);

app.listen(port, () => console.log(`app listening at port ${port}`));
