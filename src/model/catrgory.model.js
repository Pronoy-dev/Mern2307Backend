const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    subcategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "subcategory",
      },
    ],
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
