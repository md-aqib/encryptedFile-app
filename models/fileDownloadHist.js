const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileDownloadHist = new Schema({
  userName: String,
  userEmail: String,
  filename: String,
  ipAddress: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
});

fileDownloadHist.index({ location: "2dsphere" });
// fileDownloadHist.index({ location: "2d" });

module.exports = mongoose.model("fileDownloadHist", fileDownloadHist);
