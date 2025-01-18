const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const cartmodel = require('../model/cart.model')

const addtocart = async (req,res)=> {
    try {
        
    } catch (error) {
        return res
        .status(501)
        .json(
          new apiError(501, null, null, `add to cart controller error ${error} !`)
        );
    }
}

module.exports = {addtocart}