const DBfile = require("../models/fileData");
const DBRegister = require("../models/register");
const crypto = require("crypto");
const fs = require("fs");

module.exports = async (req, res) => {
  try {
    let registeredData = await DBRegister.findOne({ email: req.decoded.email });
    if (registeredData.isAdmin === false) {
      return res.json({
        success: false,
        message: "You're not Authorised to generate file.",
      });
    } else {
      if (!req.body.data || !req.body.filename) {
        return res.json({
          success: false,
          message: "Please enter all details",
        });
      } else {
        let file = req.body.filename;
        let fileData = req.body.data;
        let filedata = await DBfile.findOne({ filename: file });
        console.log(">>>>>>>", filedata);
        if (filedata && file === filedata.filename) {
          return res.json({
            success: false,
            message: "file already exist.",
          });
        } else {
          const secret = process.env.SECRET;
          const hash = crypto
            .createHmac("sha256", secret)
            .update(fileData)
            .digest("hex");
          fs.writeFile(`${file}.txt`, hash, function (err) {
            if (err) throw err;
            console.log("File is created successfully.");
          });
          let saveData = new DBfile({
            data: hash,
            filename: file,
          });
          await saveData.save();
          return res.json({
            success: true,
            message: "File generated successfully",
          });
        }
      }
    }
  } catch (ex) {
    console.log(ex);
    return res.json({
      success: false,
      message: "Something went wrong, Please try again.",
    });
  }
};
