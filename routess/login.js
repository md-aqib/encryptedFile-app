const DBregister = require("../models/register");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.json({
        success: false,
        message: "Please enter all details",
      });
    } else {
      let regData = await DBregister.findOne({ email: req.body.email });
      if (!regData || regData == null) {
        return res.json({
          success: false,
          message: "User not registered yet, Please register first",
        });
      } else {
        bcrypt.compare(req.body.password, regData.password, async function (
          err,
          result
        ) {
          if (result === true) {
            let token = await jwt.sign(
              {
                email: regData.email,
                name: regData.name,
              },
              req.app.get("secretKey"),
              { expiresIn: "1h" }
            );
            await DBregister.findOneAndUpdate(
              { email: req.body.email },
              { $set: { token: token } }
            );
            return res.json({
              success: true,
              message: "User loggedin successfully",
              token: token,
            });
          } else {
            return res.json({
              success: false,
              message: "Incorrect password",
            });
          }
        });
      }
    }
  } catch (ex) {
    return res.json({
      success: false,
      message: "Something went wrong, Please try again later.",
    });
  }
};
