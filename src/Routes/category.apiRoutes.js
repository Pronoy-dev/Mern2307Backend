const express = require("express");
const _ = express.Router();
const {
  createCategory,
  getAllCategory,
  updateCategory,
  getSingleCategory,
  delteCategory,
} = require("../controller/category.controller");
const { upload } = require("../middleware/multer.middleware");
_.route("/category")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createCategory)
  .get(getAllCategory);

_.route("/category/:id")
  .put(upload.fields([{ name: "image", maxCount: 1 }]), updateCategory)
  .get(getSingleCategory)
  .delete(delteCategory);

module.exports = _;
