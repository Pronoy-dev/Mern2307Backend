const express = require("express");
const _ = express.Router();
const { registration, login  ,verifyOtp ,resendOpt} = require("../controller/auth.controller");
_.route("/registration").post(registration);
_.route("/login").post(login);
_.route('/verify-otp').post(verifyOtp)
_.route('/resendotp').post(resendOpt)

module.exports = _;
