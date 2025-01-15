const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchmea = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("subcategory", subCategorySchmea);
