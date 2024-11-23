const express = require("express");
const _ = express.Router();
const { registration, login } = require("../controller/auth.controller");
_.route("/registration").post(registration);
_.route("/login").post(login);

module.exports = _;
