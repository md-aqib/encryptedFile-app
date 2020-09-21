const DBdownHistory = require("../models/fileDownloadHist");
const DBregister = require("../models/register");

module.exports = async (req, res) => {
  try {
    let registeredData = await DBregister.findOne({ email: req.decoded.email });
    if (registeredData.isAdmin === false) {
      return res.json({
        success: false,
        message: "You're not allowed to use filter",
      });
    }
    if (!req.body.long || !req.body.lat) {
      return res.json({
        success: false,
        message: "Please provide all the details",
      });
    } else {
      const downloadHistory = await DBdownHistory.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [
                parseFloat(req.body.long),
                parseFloat(req.body.lat),
              ],
            },
            distanceField: "dist.calculated",
            spherical: true,
          },
        },
        { $sort: { "dist.calculated": 1 } },
      ]);

      if (!downloadHistory) {
        return res.json({
          success: false,
          message: "No data found",
        });
      }

      return res.json({
        success: true,
        message: "Downloaded file history",
        data: downloadHistory,
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({
      success: false,
      message: "Somthing went wrong, Please try again later",
    });
  }
};
