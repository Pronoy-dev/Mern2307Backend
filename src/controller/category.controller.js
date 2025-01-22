const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const categoryModel = require("../model/catrgory.model");
const {
  uploadFileCloudinary,
  delteCloudinaryImage,
} = require("../utils/cloudinary");

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
        .json(new apiResponse(200, null, `Category Create Sucessfull`));
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

// get all category

const getAllCategory = async (req, res) => {
  try {
    const allCategory = await categoryModel.find().populate("subcategory");
    if (allCategory?.length) {
      return res
        .status(200)
        .json(
          new apiResponse(200, `Category Create Sucessfull`, allCategory, false)
        );
    }

    return res
      .status(401)
      .json(new apiError(401, null, null, `Category Not Found !!`));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `getAll category controller Error : ${error}`
        )
      );
  }
};

// update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const findCategory = await categoryModel.findById(id);
    if (!findCategory) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Category Not Found !!`));
    }
    let updatedObject = {};
    if (name) {
      updatedObject.name = name;
    }

    if (req.files?.image) {
      const { path } = req.files?.image[0];
      // remove the old image from cloudinary
      const oldImage = findCategory.image?.split("/");
      const cloudinaryPath = oldImage[oldImage?.length - 1]?.split(".")[0];
      const deltedResoures = await delteCloudinaryImage(cloudinaryPath);
      if (deltedResoures) {
        const { secure_url } = await uploadFileCloudinary(path);
        updatedObject.image = secure_url;
      }
    }

    console.log(updatedObject);

    // finally update the

    // const image =
    // find the object

    const updatedCategory = await categoryModel.findOneAndUpdate(
      { _id: id },
      { ...updatedObject },
      { new: true }
    );
    if (updatedCategory) {
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            `Category updated Sucessfull`,
            updatedCategory,
            false
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `update category controller Error : ${error}`
        )
      );
  }
};

// get single category
const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCategory = await categoryModel.findById(id).populate("product");
    if (!singleCategory) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `get Single category Not Found`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `Category Retrive  Sucessfull`,
          singleCategory,
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
          `get Single category controller Error : ${error}`
        )
      );
  }
};

// delte category controller
const delteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryModel.findOneAndDelete({ _id: id });
    if (deletedCategory) {
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            `Category Deleted  Sucessfull `,
            deletedCategory,
            false
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `Delte category controller Error : ${error}`
        )
      );
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  getSingleCategory,
  delteCategory,
};
