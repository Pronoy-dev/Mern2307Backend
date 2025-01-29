const express = require("express");
const _ = express.Router();
const { authguard } = require("../middleware/authguard.middleware");
const { placeorder } = require("../controller/order.controller");
_.route("/placeorder").post(authguard, placeorder);
module.exports = _;
