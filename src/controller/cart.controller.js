const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const cartmodel = require("../model/cart.model");

const addtocart = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Cart Credential missing`));
    }

    // is already exist this product into cart

    const isExist = await cartmodel.find({ product: product });
    if (isExist?.length) {
      return res
        .status(401)
        .json(
          new apiError(401, null, null, `Already This product Add to cart `)
        );
    }
    // now save the database
    const cart = await cartmodel.create({
      user: req.user._id,
      product,
      quantity,
    });
    if (!cart) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Add to cart Failed`));
    }
    return res
      .status(200)
      .json(new apiResponse(200, `Add to cart  Sucessfull`, cart, false));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(501, null, null, `add to cart controller error ${error} !`)
      );
  }
};

// get all add to cart item
const getalladdtocartItem = async (req, res) => {
  try {
    const allcart = await cartmodel
      .find()
      .populate({
        path: "user",
        select:
          "-password -isVerifed  -role -createdAt -updatedAt -otp -otpExpireDate",
      })
      .populate({
        path: "product",
      });
    if (!allcart) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Cart Not Found`));
    }
    return res
      .status(200)
      .json(
        new apiResponse(200, `Getall cart Retrive  Sucessfull`, allcart, false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `get all add to cart controller Error : ${error}`
        )
      );
  }
};

// remove add to cart
const removeAddtoCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedcart = await cartmodel.findOneAndDelete({ _id: id });

    if (!deletedcart) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `cart Not Found`));
    }
    return res
      .status(200)
      .json(
        new apiResponse(200, `cart  delete Sucessfull`, deletedcart, false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `remove add to cart controller Error : ${error}`
        )
      );
  }
};

const userAddtoCart = async (req, res) => {
  try {
    const deletedcart = await cartmodel
      .find({ user: req.user._id })
      .populate({
        path: "user",
        select:
          "-password -isVerifed  -role -createdAt -updatedAt -otp -otpExpireDate",
      })
      .populate({
        path: "product",
      });

    if (!deletedcart) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `cart Not Found`));
    }

    // extract all item and total price
    const cartinfo = deletedcart.reduce(
      (initalvalue, item) => {
        const { product, quantity } = item;
        initalvalue.totalPrice += product.price * quantity;
        initalvalue.totaitem += quantity;
        return initalvalue;
      },
      {
        totalPrice: 0,
        totaitem: 0,
      }
    );

    const { totalPrice, totaitem } = cartinfo;
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `cart retrive  Sucessfull`,
          { userCartItem: deletedcart, totalPrice, totaitem },
          false
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `userAddtoCart controller Error : ${error}`
        )
      );
  }
};

const incrementCartItem = async (req, res) => {
  try {
    const { cart } = req.query;
    const cartitem = await cartmodel.findOne({ user: req.user._id, _id: cart });
    if (!cartitem) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Cart item Not Found`));
    }
    cartitem.quantity += 1;
    await cartitem.save();
    return res
      .status(200)
      .json(new apiResponse(200, `Cart Item Sucessfull`, cartitem, false));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `incrementCartItem controller Error : ${error}`
        )
      );
  }
};

// decrement cartitem
const decrementCartItem = async (req, res) => {
  try {
    const { cart } = req.query;
    const cartitem = await cartmodel.findOne({ user: req.user._id, _id: cart });
    if (!cartitem) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Cart item Not Found`));
    }
    if (cartitem.quantity > 1) {
      cartitem.quantity -= 1;
      await cartitem.save();
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            `Cart Item decrement Sucessfull`,
            cartitem,
            false
          )
        );
    }
    return res.status(401).json({ msg: "Quantity at least 1" });
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `decrementCartItem controller Error : ${error}`
        )
      );
  }
};
module.exports = {
  addtocart,
  getalladdtocartItem,
  removeAddtoCart,
  userAddtoCart,
  incrementCartItem,
  decrementCartItem,
};
