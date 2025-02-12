const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const orderModel = require("../model/order.model");
const cartModel = require("../model/cart.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const crypto = require("crypto");

const store_id = "mern2679a4d11877d6";
const store_passwd = "mern2679a4d11877d6@ssl";
const is_live = false;
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
    } else if (paymentmethod === "online") {
      const id = crypto.randomUUID();
      let tran_id = id.split("-")[0];
      const data = {
        total_amount: orderinfo.totalPrice,
        currency: "BDT",
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: "http://localhost:3000/api/v1/success",
        fail_url: "http://localhost:3000/api/v1/fail",
        cancel_url: "http://localhost:3000/api/v1/cancel",
        ipn_url: "http://localhost:3000/api/v1/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const apiResponse = await sslcz.init(data);
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      const order = await new orderModel({
        user: req.user._id,
        cartItem: orderinfo.cart,
        customerinfo: customerinfo,
        paymentinfo: paymentinfo,
        subTotal: orderinfo.totalPrice,
        totalQuantity: orderinfo.totalQuantity,
      }).save();

      order.paymentinfo.tran_id = tran_id;
      await order.save();

      return res.status(200).json({ url: GatewayPageURL });
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
