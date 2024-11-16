const express = require("express");
const _ = express.Router();
const { registration } = require("../controller/auth.controller");
_.route("/registration").post(registration);

module.exports = _;
