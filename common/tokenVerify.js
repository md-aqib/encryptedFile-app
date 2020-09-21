const jwt = require("jsonwebtoken");
const DBregister = require("../models/register");

module.exports = (req, res, next) => {
  token = req.headers["token"];
  if (token) {
    jwt.verify(token, req.app.get("secretKey"), (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          msg: "something went wrong or token expired",
        });
      } else {
        DBregister.findOne({ email: decoded.email }, (err, login) => {
          if (err) {
            res.json({
              success: false,
              msg: "DB_ERROR",
            });
          } else if (login && login.token == req.headers["token"]) {
            req.decoded = decoded;
            next();
          } else {
            res.json({
              success: true,
              msg: "unauthorized token",
            });
          }
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: "token not found",
    });
  }
};
