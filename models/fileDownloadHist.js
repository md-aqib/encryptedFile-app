const mongoose = require("mongoose");
const { Schema } = mongoose;

const downloadHistory = new Schema({
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

module.exports = mongoose.model("fileDownloadHist", downloadHistory);
