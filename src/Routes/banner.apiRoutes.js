const express = require("express");
const _ = express.Router();
const {
  createBanner,
  getAllBanner,
  updateBanner,
  deleteBanner,
} = require("../controller/banner.controller");
const { upload } = require("../middleware/multer.middleware");
_.route("/banner")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createBanner)
  .get(getAllBanner);
_.route("/banner/:bannerId")
  .put(upload.fields([{ name: "image", maxCount: 1 }]), updateBanner)
  .delete(deleteBanner);
module.exports = _;
