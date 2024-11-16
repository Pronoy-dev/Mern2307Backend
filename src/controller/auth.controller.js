const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const registration = async (req, res) => {
  try {
 
    res
      .status(200)
      .json(new apiResponse(200, "Registraion Sucessfull", null, false));
  } catch (error) {
    res
      .status(500)
      .json(
        new apiError(500, null, null, `Registraion controller Error : ${error}`)
      );
  }
};

module.exports = { registration };
