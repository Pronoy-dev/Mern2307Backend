const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;

const flashSaleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  product: {
    type: Types.ObjectId,
    ref: "product",
    required: true,
  },
});

module.exports = model("flashsale", flashSaleSchema);
