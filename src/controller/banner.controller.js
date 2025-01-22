const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const bannerModel =require('../model/banner.model');
const { uploadFileCloudinary } = require("../utils/cloudinary");

const createBanner = async (req,res)=> {
    try{
    const {title} = req.body;
    if(!title ){
        return res
        .status(401)
        .json(
          new apiError(401, null, null, `title Missing !`)
        );
    }

    if(!req.files){
        return res
        .status(401)
        .json(
          new apiError(401, null, null, `image Missing !`)
        );
    }

    // check is already exist banner
    const isalreadyexist = await bannerModel.find({title});
    if(isalreadyexist?.length){
        return res
        .status(401)
        .json(
          new apiError(401, null, null, `this banner alrady exist try another one  !`)
        );
    }

    // now upload the image in cloudinary
    const image = req.files?.image[0];
   
    const {url} =  await uploadFileCloudinary(image?.path)
    if(!url){
        return res
        .status(501)
        .json(
          new apiError(501, null, null, `Image upload failed!`)
        );
    }

    // save the data into datbase
    const saveBanner = await new bannerModel({
        title:title,
        image: url
    }).save()
    if(!saveBanner)  {
        return res
            .status(501)
            .json(
            new apiError(501, null, null, `banner upload failed!`)
            );
    }  

    return res
    .status(200)
    .json(
      new apiResponse(
        200,
        `Banner upload   Sucessfull`,
        saveBanner,
        false
      )
    );

    }catch(error){
        return res
        .status(500)
        .json(
          new apiError(500, null, null, `create banner controller Error : ${error}`)
        );
    }
}

// get all banner
const getAllBanner = async (req,res)=> {
    try {
        const allbanner = await bannerModel.find({});
        if(!allbanner){
            return res
            .status(501)
            .json(
            new apiError(501, null, null, `banner not Found!`)
            );
        }

        return res
    .status(200)
    .json(
      new apiResponse(
        200,
        `Banner retrive   Sucessfull`,
        allbanner,
        false
      )
    );
    } catch (error) {
        return res
        .status(500)
        .json(
          new apiError(500, null, null, `get all banner controller Error : ${error}`)
        );
    }
}

module.exports = {createBanner ,getAllBanner}