const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const categoryModel = require("../model/catrgory.model");
const { uploadFileCloudinary } = require("../utils/cloudinary");
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.files) {
      return res
        .status(400)
        .json(new apiError(400, null, null, `image Missing !!`));
    }

    const { secure_url } = await uploadFileCloudinary(
      req.files?.image[0]?.path
    );

    // now save the info of database
    const savedata = await new categoryModel({
      name,
      image: secure_url,
    }).save();

    if (savedata) {
      return res
        .status(200)
        .json(new apiError(200, null, `Category Create Sucessfull`));
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `create category controller Error : ${error}`
        )
      );
  }
};

module.exports = { createCategory };
