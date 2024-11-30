const express = require("express");
const _ = express.Router();
const { createCategory } = require("../controller/category.controller");
const { upload } = require("../middleware/multer.middleware");
_.route("/category").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  createCategory
);
module.exports = _;
