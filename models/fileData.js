const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileData = new Schema({
  filename: String,
  data: String,
  downloadedBy: [{ type: Schema.Types.ObjectId, ref: "register" }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("fileData", fileData);
