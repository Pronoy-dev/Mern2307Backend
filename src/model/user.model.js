const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      // unique: true,
    },

    adress1: {
      type: String,
    
      trim: true,
    },
    adress2: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isVerifed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    otp: {
      type: Number,
    },
    otpExpireDate: {
      type: Number,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const usermodel = mongoose.model("user", userSchema);
module.exports = usermodel;
