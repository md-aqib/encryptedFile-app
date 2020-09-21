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
          isAdmin: true,
        });
        await saveData.save();
        return res.json({
          success: true,
          message: "User registered successfully.",
        });
      }
    }
  } catch (ex) {
    console.log(ex);
    return res.json({
      success: false,
      message: "Something went wrong, Please try again again later.",
    });
  }
};
