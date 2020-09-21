const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const register = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 10,
  },
  age: Number,
  isAdmin: Boolean,
  token: String,
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
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

register.pre("save", function (next) {
  let user = this;
  if (user.password) {
    bcrypt.genSalt(8, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(err);
      });
    });
  }
});

register.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("register", register);
