const express = require("express");
const _ = express.Router();
const {
  createflashSale,
  getAllFlashSale,
} = require("../controller/flashSale.controller");
_.route("/flashsale").post(createflashSale).get(getAllFlashSale);
module.exports = _;
