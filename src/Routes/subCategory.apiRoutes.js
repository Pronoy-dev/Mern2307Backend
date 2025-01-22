const express = require("express");
const _ = express.Router();
const {
  createSubCategory,
  allSubCategory,
  getSingleSubCategory,
  updateSubCategory,
  deletesubCategory
} = require("../controller/subCategory.controller");
_.route("/subcategory").post(createSubCategory).get(allSubCategory);
_.route("/subcategory/:subid").get(getSingleSubCategory).put(updateSubCategory).delete(deletesubCategory);
module.exports = _;
