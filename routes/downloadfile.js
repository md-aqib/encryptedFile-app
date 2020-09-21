const DBfile = require("../models/fileData");
const DBregister = require("../models/register");
const DBdownHistory = require("../models/fileDownloadHist");
const geoip = require("geoip-lite");

module.exports = async (req, res) => {
  try {
    let registeredData = await DBregister.findOne({ email: req.decoded.email });
    if (registeredData.isAdmin === true) {
      return res.json({
        success: false,
        message: "You're not allowed to download file",
      });
    } else {
      if (!req.body.filename) {
        return res.json({
          success: false,
          message: "Please enter filename",
        });
      } else {
        let file = await DBfile.findOne({ filename: req.body.filename });
        if (!file || file === null) {
          return res.json({
            success: false,
            message: "file does not exist",
          });
        } else {
          let ip = "207.97.227.239"; //for dynamic ip use 'req.connection.remoteAddress';
          let geo = geoip.lookup(ip);
          let updatedUser = await DBregister.findOneAndUpdate(
            { email: req.decoded.email },
            { $set: { "location.coordinates": geo.ll, ipAddress: ip } },
            { new: true, upsert: true }
          );
          let updatedFile = await DBfile.findOneAndUpdate(
            { filename: req.body.filename },
            { $push: { downloadedBy: registeredData._id } },
            {
              new: true,
            }
          );
          let saveDownHistory = new DBdownHistory({
            userName: updatedUser.name,
            userEmail: updatedUser.email,
            filename: req.body.filename,
            ipAddress: ip,
            location: {
              coordinates: [-73.88, 40.78], //geo.ll,
            },
          });
          await saveDownHistory.save();
          res.download(req.body.filename + ".txt");
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
