const express = require("express");
const _ = express.Router();
const payment = require("../controller/payment.controller");
_.route("/success").post(payment.paymentSucess);
_.route("/fail").post(payment.paymentFailed);
_.route("/cancel").post(payment.paymentCancle);
_.route("/ipn").post(payment.paymentIpn);

module.exports = _;
