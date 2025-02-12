const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");

exports.paymentSucess = async (req, res) => {
  try {
    // return res
    //   .status(200)
    //   .json(new apiResponse(200, `Payment Sucessfull`, null, false));
    res.redirect("http://localhost:5173/success");
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(501, null, null, `payment sucess controller failed!`));
  }
};

exports.paymentCancle = async (req, res) => {
  try {
    res.redirect("http://localhost:5173/failed");
    return res
      .status(200)
      .json(new apiResponse(200, `Payment Cancel`, null, false));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(501, null, null, `paymentCancle controller failed!`));
  }
};

exports.paymentFailed = async (req, res) => {
  try {
    res.redirect("http://localhost:5173/failed");
    return res
      .status(200)
      .json(new apiResponse(200, `Payment paymentFailed`, null, false));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(501, null, null, ` paymentFailed controller failed!`));
  }
};

exports.paymentIpn = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new apiResponse(200, ` paymentIpn sucessfull`, null, false));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(501, null, null, ` paymentIpn controller failed!`));
  }
};
