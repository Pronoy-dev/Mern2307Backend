const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;

const cartSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
  product: {
    type: Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPrice: {
    type: Number,
  },
});

module.exports = model("cart", cartSchema);
