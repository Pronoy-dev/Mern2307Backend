const subcategoryModel = require("../model/subcategory.model");
const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const categoryModel = require('../model/catrgory.model')
// create sub category controller
const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;



    // validate user info
    if (!name || !category) {
      return res
        .status(401)
        .json(
          new apiError(401, null, null, `sub category Crendintail Missing !!`)
        );
    }

    // check isAlrady exist in database
    const isAlreadyExist = await subcategoryModel.find({ name: name });

    if (isAlreadyExist?.length) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `${name} is Aleady Exist`));
    }

    // now save the subcategory info in database
    const saveSubCategory = await subcategoryModel.create({
      name: name,
      category: category,
    });

    // search the category 
    const searchcategory = await categoryModel.findById(category);
    searchcategory.subcategory.push(saveSubCategory._id);
    await searchcategory.save()

    if (!saveSubCategory) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `SubCategory created Failed `));
    }


    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `subCategory Created  Sucessfull`,
          saveSubCategory,
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
          `create subcategory controller Error : ${error}`
        )
      );
  }
};

// get all Subcategory
const allSubCategory = async (req, res) => {
  try {
    const subcategory = await subcategoryModel.find({}).populate("category");
    if (!subcategory) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Retrive subcategory Failed`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `subCategory Retrive   Sucessfull`,
          subcategory,
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
          `get all subcategory controller Error ${error}`
        )
      );
  }
};

// getsinglesubCategory controller
const getSingleSubCategory = async (req, res) => {
  try {
    const { subid } = req.params;
    const sigleSubcategory = await subcategoryModel
      .findById(subid)
      .populate("category");
    if (!sigleSubcategory) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `single subcategory Not found !!`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `single subCategory retirve  Sucessfull`,
          sigleSubcategory,
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
          `single subcategory controller Error : ${error}`
        )
      );
  }
};

// update subcategory
const updateSubCategory = async (req, res) => {
  try {
    const { subid } = req.params;
    if (!subid) {
      return res
        .status(500)
        .json(
          new apiError(
            500,
            null,
            null,
            `params id or updated credential missing`
          )
        );
    }
    const updatatedData = await subcategoryModel.findByIdAndUpdate(
      {
        _id: subid,
      },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (!updatatedData) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Update subcategory Failed`));
    }
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          `subCategory Update  Sucessfull`,
          updatatedData,
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
          `updateSubCategory controller Error : ${error}`
        )
      );
  }
};

// delte subcategory 
const deletesubCategory = async (req, res) => {
  try {
    const { subid } = req.params
    const findsubCategory = await subcategoryModel.findByIdAndDelete(subid);
    if (!findsubCategory) {
      return res
        .status(500)
        .json(
          new apiError(
            500,
            null,
            null,
            `delete SubCategory Failed`
          )
        );
    }
    const searchCategory = await categoryModel.findById(findsubCategory.category);
    searchCategory.subcategory.pull(subid);
    await searchCategory.save()
    return res
      .status(200)
      .json(
        new apiResponse(
          500,
          null,
          null,
          `delete SubCategory sucessfull`
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
          `delete SubCategory controller Error : ${error}`
        )
      );
  }
}
module.exports = {
  createSubCategory,
  allSubCategory,
  getSingleSubCategory,
  updateSubCategory,
  deletesubCategory
};
