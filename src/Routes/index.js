const express = require("express");
const _ = express.Router();
const authRoutes = require("./auth.apiRoutes");
const categoryRoutes = require("./category.apiRoutes");
const { apiError } = require("../utils/ApiError");
const subcategoryApiRoutes = require("../Routes/subCategory.apiRoutes");
const productApiRoutes = require("../Routes/product.apiRoutes");
const bannerRoures =require('../Routes/banner.apiRoutes')
_.use("/api/v1/auth", authRoutes);
_.use("/api/v1", categoryRoutes);
_.use("/api/v1", subcategoryApiRoutes);
_.use("/api/v1", productApiRoutes);
_.use("/api/v1", bannerRoures);
_.use("*", (req, res) => {
  return res.status(500).json(new apiError(500, null, null, `Invalid Routes`));
});
module.exports = _;
