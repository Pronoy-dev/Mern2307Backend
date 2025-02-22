const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const bannerModel = require("../model/banner.model");
const {
  uploadFileCloudinary,
  delteCloudinaryImage,
} = require("../utils/cloudinary");

const createBanner = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `title Missing !`));
    }

    if (!req.files) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `image Missing !`));
    }

    // check is already exist banner
    const isalreadyexist = await bannerModel.find({ title });
    if (isalreadyexist?.length) {
      return res
        .status(401)
        .json(
          new apiError(
            401,
            null,
            null,
            `this banner alrady exist try another one  !`
          )
        );
    }

    // now upload the image in cloudinary
    const image = req.files?.image[0];

    const { url } = await uploadFileCloudinary(image?.path);
    if (!url) {
      return res
        .status(501)
        .json(new apiError(501, null, null, `Image upload failed!`));
    }

    // save the data into datbase
    const saveBanner = await new bannerModel({
      title: title,
      image: url,
    }).save();
    if (!saveBanner) {
      return res
        .status(501)
        .json(new apiError(501, null, null, `banner upload failed!`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, `Banner upload   Sucessfull`, saveBanner, false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `create banner controller Error : ${error}`
        )
      );
  }
};

// get all banner
const getAllBanner = async (req, res) => {
  try {
    const allbanner = await bannerModel.find({});
    if (!allbanner) {
      return res
        .status(501)
        .json(new apiError(501, null, null, `banner not Found!`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, `Banner retrive   Sucessfull`, allbanner, false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `get all banner controller Error : ${error}`
        )
      );
  }
};

// banner update controller

const updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { title } = req.body;
    const image = req.files?.image ? req.files.image[0] : null;

    // Ensure that the banner exists first
    const banner = await bannerModel.findById(bannerId);
    if (!banner) {
      return res
        .status(404)
        .json(new apiError(404, null, null, `Banner not found!`));
    }

    // If the title is being updated
    if (title && title !== banner.title) {
      banner.title = title; // Update the title
    }

    // If image is being updated
    if (image) {
      // Delete the old image from Cloudinary
      const cloudinaryPath = banner.image?.split("/").pop().split(".")[0]; // Extract the public ID of the previous image
      if (cloudinaryPath) {
        await delteCloudinaryImage(cloudinaryPath); // Delete previous image from cloudinary
      }

      // Upload the new image to Cloudinary
      const { url } = await uploadFileCloudinary(image.path);
      if (!url) {
        return res
          .status(501)
          .json(new apiError(501, null, null, `Image upload failed!`));
      }
      banner.image = url; // Update the banner with the new image URL
    }

    // Save the updated banner to the database
    const updatedBanner = await banner.save();

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `Banner updated successfully`,
          updatedBanner,
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
          `Update banner controller Error: ${error}`
        )
      );
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params; // Get the bannerId from request parameters

    // Ensure that the banner exists
    const banner = await bannerModel.findById(bannerId);
    if (!banner) {
      return res
        .status(404)
        .json(new apiError(404, null, null, `Banner not found!`));
    }

    // Delete the image from Cloudinary
    const cloudinaryPath = banner.image?.split("/").pop().split(".")[0]; // Extract the public ID of the image
    if (cloudinaryPath) {
      await delteCloudinaryImage(cloudinaryPath); // Delete image from Cloudinary
    }

    // Delete the banner from the database
    const deletedBanner = await bannerModel.findByIdAndDelete(bannerId);
    if (!deletedBanner) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Failed to delete banner!`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `Banner deleted successfully`,
          deletedBanner,
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
          `Delete banner controller Error: ${error}`
        )
      );
  }
};

module.exports = { createBanner, getAllBanner, updateBanner, deleteBanner };
