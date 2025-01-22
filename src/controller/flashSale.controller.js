const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const flashsaleModel = require("../model/flashSale.model");

const createflashSale = async (req, res) => {
  try {
    const { name, product } = req.body;
    if (!name || !product) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Flash sale credential Missing`));
    }

    // save the informatio into database
    const saveFlashSale = await flashsaleModel.create({ name, product });
    if (!saveFlashSale) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Flash Sale Created Failed`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `FlashSale upload   Sucessfull`,
          saveFlashSale,
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
          `create flashSale controller Error : ${error}`
        )
      );
  }
};

// get all flashSale controller
const getAllFlashSale = async (req, res) => {
  try {
    const allflashsale = await flashsaleModel.find().populate("product");
    if (!allflashsale) {
      return res
        .status(500)
        .json(new apiError(500, null, null, ` flashSale retrived Failed`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `FlashSale retrived   Sucessfull`,
          allflashsale,
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
          `create flashSale controller Error : ${error}`
        )
      );
  }
};
module.exports = { createflashSale, getAllFlashSale };
