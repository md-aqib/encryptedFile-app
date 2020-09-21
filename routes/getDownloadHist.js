const DBfileHist = require("../models/fileDownloadHist");
const DBregister = require("../models/register");

module.exports = async (req, res) => {
  try {
    let regData = await DBregister.findOne({ email: req.decoded.email });
    if (regData.isAdmin === false) {
      return res.json({
        success: false,
        message: "You are not allowed",
      });
    }
    if (req.body.itemperpage && req.params.page) {
      let page = req.params.page;
      let ipp = req.body.itemperpage;
      let startIndex = (page - 1) * ipp;
      let endIndex = page * ipp;
      let fileDownloadHist = await DBfileHist.find({});
      let finalData = fileDownloadHist.slice(startIndex, endIndex);
      res.json(finalData);
    } else {
      return res.json({
        success: false,
        message: "Please enter page and ipp",
      });
    }
  } catch (ex) {
    console.log(ex);
    return res.json({
      success: false,
      message: "Something went wrong, Please try again later",
    });
  }
};
