const express = require("express");
const _ = express.Router();
const {
  createProduct,
  gelAllproducts,
  getSingleProduct,
  updateProductInformation,
} = require("../controller/product.controller");
const { upload } = require("../middleware/multer.middleware");
_.route("/product")
  .post(upload.fields([{ name: "image", maxCount: 10 }]), createProduct)
  .get(gelAllproducts);
_.route("/product/:id").get(getSingleProduct);
_.route("/update-productinfo/:id").put(updateProductInformation);
module.exports = _;