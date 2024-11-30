const express = require("express");
const _ = express.Router();
const authRoutes = require("./auth.apiRoutes");
const categoryRoutes = require("./category.apiRoutes");
const { apiError } = require("../utils/ApiError");
_.use("/api/v1/auth", authRoutes);
_.use("/api/v1", categoryRoutes);
_.use("*", (req, res) => {
  return res.status(500).json(new apiError(500, null, null, `Invalid Routes`));
});
module.exports = _;
