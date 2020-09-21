const DBfile = require("../models/fileData");
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
      let fileDownloadHist = await DBfile.find({}).populate("downloadedBy");

      let mappeddata = fileDownloadHist.map((e) => {
        return e.downloadedBy.map((ele) => {
          console.log("././.", ele.location);
          modData = {
            filename: e.filename,
            data: e.data,
            dowloadedBy: {
              name: ele.name,
              email: ele.email,
              location: ele.location,
              ipAddress: ele.ipAddress,
            },
          };
          return modData;
        });
      });
      let sortedData = mappeddata.slice(startIndex, endIndex);
      res.json(sortedData);
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
