const DBdownHistory = require("../models/fileDownloadHist");

module.exports = async (req, res, next) => {
  try {
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
