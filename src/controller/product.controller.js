const productmodel = require("../model/product.model");
const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const { uploadFileCloudinary } = require("../utils/cloudinary");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const createProduct = async (req, res) => {
  try {
    const { name, description, price, rating, stock, color } = req.body;
    if (!name || !description || !price || !rating || !stock || !color) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Product Credential Missing !!`));
    }

    if (!req.files) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `Product image Missing !!`));
    }

    // check existing product in database
    const isExist = productmodel.find({ name: name });
    if (isExist?.length) {
      return res
        .status(401)
        .json(new apiError(401, null, null, ` product Already Exist`));
    }

    // new product image upload cloudinary
    const cloudinaryImageUrl = [];

    const productUploader = async (path) => {
      const { secure_url } = await uploadFileCloudinary(path);
      cloudinaryImageUrl.push(secure_url);
    };
    for (let image of req.files.image) {
      await productUploader(image.path);
    }

    // now save the product imformation into database

    const saveProduct = await productmodel.create({
      name,
      description,
      price,
      rating,
      stock,
      color,
      image: cloudinaryImageUrl,
    });
    if (!saveProduct) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Product UPload failed Try again`));
    }
    return res
      .status(200)
      .json(new apiResponse(200, saveProduct, `Product upload  Sucessfull`));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `create product controller Error : ${error}`
        )
      );
  }
};

// get all product
const gelAllproducts = async (req, res) => {
  try {
    const CahcedData = myCache.get("allproduct");
    if (CahcedData === undefined) {
      const allProducts = await productmodel.find({});
      if (allProducts) {
        myCache.set("allproduct", JSON.stringify(allProducts), 60 * 60 * 60);
        return res
          .status(200)
          .json(
            new apiResponse(200, allProducts, `All product Retrive Sucessfull`)
          );
      }
      return res
        .status(500)
        .json(new apiError(500, null, null, `Product not Found !!`));
    } else {
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            JSON.parse(CahcedData),
            `All product Retrive Sucessfull (from Cached)`
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
          `Get All product controller Error : ${error}`
        )
      );
  }
};

// get singleProduct
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const searchProduct = await productmodel.findOne({ _id: id });
    if (!searchProduct) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Product not Found !!`));
    }
    return res
      .status(200)
      .json(new apiResponse(200, searchProduct, ` product Retrive Sucessfull`));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(500, null, null, `Get single controller Error ${error}`)
      );
  }
};
// update product controller
const updateProductInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateProductData = await productmodel
      .findOneAndUpdate({ _id: id }, { ...req.body }, { new: true })
      .select("-image");
    if (!updateProductData) {
      return res
        .status(500)
        .json(
          new apiError(500, null, null, `product information update Failed `)
        );
    }
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          updateProductData,
          ` productinformation update Sucessfull`
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
          `product update controller Error ${error}`
        )
      );
  }
};
module.exports = {
  createProduct,
  gelAllproducts,
  getSingleProduct,
  updateProductInformation,
};
