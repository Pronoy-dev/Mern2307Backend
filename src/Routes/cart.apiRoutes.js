const express = require("express");
const _ = express.Router();
const {
  addtocart,
  getalladdtocartItem,
  removeAddtoCart,
  userAddtoCart,
  incrementCartItem,
  decrementCartItem,
} = require("../controller/cart.controller");
const { authguard } = require("../middleware/authguard.middleware");
_.route("/addtocart").post(authguard, addtocart).get(getalladdtocartItem);
_.route("/addtocart/:id")
  .delete(authguard, removeAddtoCart)
  .get(authguard, userAddtoCart);
_.route("/cartincrement").post(authguard, incrementCartItem);
_.route("/cartdecrement").post(authguard, decrementCartItem);

module.exports = _;
