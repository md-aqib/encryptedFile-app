const DBregister = require("../models/register");

module.exports = async (req, res) => {
  try {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.name ||
      !req.body.age
    ) {
      return res.json({
        success: false,
        message: "Please enter all details",
      });
    } else {
      let regData = await DBregister.findOne({ email: req.decoded.email });
      if (regData.isAdmin === false) {
        return res.json({
          success: false,
          message: "You're not allowed to make any changes.",
        });
      } else {
        let data = await DBregister.findOne({ email: req.body.email });
        if (data || data != null) {
          return res.json({
            success: false,
            message: "User already registered",
          });
        } else {
          saveData = new DBregister({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            age: req.body.age,
            isAdmin: false,
          });
          await saveData.save();
          return res.json({
            success: true,
            message: "User registered successfully.",
          });
        }
      }
    }
  } catch (ex) {
    return res.json({
      success: false,
      message: "Something went wrong, Please try again again later.",
    });
  }
};
