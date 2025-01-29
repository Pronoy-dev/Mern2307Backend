const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const orderModel = require("../model/order.model");
const cartModel = require("../model/cart.model");
// place order controller
const placeorder = async (req, res) => {
  try {
    const { customerinfo, paymentinfo } = req.body;
    const { phone, address1, city, district } = customerinfo;
    const { paymentmethod } = paymentinfo;

    // data validation
    if (!phone || !address1 || !city || !district) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Order Information Missing`));
    }
    // extract the user id using middleware
    const { _id } = req.user;
    const userCart = await cartModel
      .find({ user: _id })
      .populate({
        path: "user",
        select:
          "-password -isVerifed  -role -createdAt -updatedAt -otp -otpExpireDate",
      })
      .populate({
        path: "product",
      });
    if (!userCart) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Cart Not Found`));
    }

    // extract cartid price and qunatantity and calculate total price
    const orderinfo = userCart.reduce(
      (initalItem, item) => {
        const { _id, product, quantity } = item;
        initalItem.cart.push(_id);
        initalItem.totalQuantity += parseInt(quantity);
        initalItem.totalPrice += parseInt(product.price);
        return initalItem;
      },
      {
        cart: [],
        totalPrice: 0,
        totalQuantity: 0,
      }
    );
    if (paymentmethod === "cash") {
      // now save the order information into database
      const order = await new orderModel({
        user: req.user._id,
        cartItem: orderinfo.cart,
        customerinfo: customerinfo,
        paymentinfo: paymentinfo,
        subTotal: orderinfo.totalPrice,
        totalQuantity: orderinfo.totalQuantity,
      }).save();
      res.send(order);
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(500, null, null, `placeorder controller Error : ${error}`)
      );
  }
};

module.exports = { placeorder };
