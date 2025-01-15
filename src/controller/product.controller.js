const productmodel = require("../model/product.model");
const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const categoryModel = require("../model/catrgory.model");
const subcategoryModel = require("../model/subcategory.model");
const {
  uploadFileCloudinary,
  delteCloudinaryImage,
} = require("../utils/cloudinary");
const NodeCache = require("node-cache");
const { createConnection } = require("mongoose");
const myCache = new NodeCache();
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      rating,
      stock,
      color,
      category,
      subcategory,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !rating ||
      !stock ||
      !color ||
      !category ||
      !subcategory
    ) {
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
      category,
      subcategory,
    });
    if (!saveProduct) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `Product UPload failed Try again`));
    }

    // save the recently uploaded product into category database
    const findCategory = await categoryModel.findById(category);
    findCategory.product.push(saveProduct._id);
    await findCategory.save();
    // save the recently uploaded product into subcategory database
    const findSubCategory = await subcategoryModel.findById(subcategory);
    findSubCategory.product.push(saveProduct._id);
    await findSubCategory.save();
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
            new apiResponse(
              200,
              `All product Retrive Sucessfull`,
              allProducts,
              false
            )
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
            `All product Retrive Sucessfull (from Cached)`,
            JSON.parse(CahcedData),
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
      .json(
        new apiResponse(200, `product Retrive Sucessfull`, searchProduct, false)
      );
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

//  update product iamge
const updateProductImage = async (req, res) => {
  try {
    const { imageinfo } = req.body;
    const { id } = req.params;
    if (!imageinfo?.length) {
      return res
        .status(401)
        .json(
          new apiError(401, null, null, `product update image info not found!!`)
        );
    }

    // check file is empty or not
    if (!req.files) {
      return res
        .status(401)
        .json(
          new apiError(401, null, null, `product update image  not found!!`)
        );
    }
    // delte the imageinfo

    // delte all item
    for (let image in imageinfo) {
      const allParticle = image.split("/");
      const cloudinaryUrl = allParticle[allParticle.length - 1].split(".")[0];
      const deltedImage = await delteCloudinaryImage(cloudinaryUrl);
      console.log(deltedImage);
    }

    // upload the new image

    const newupdateImage = [];
    for (let image of req.files.image) {
      const { url } = await uploadFileCloudinary(image.path);
      newupdateImage.push(url);
    }

    // search the database
    const product = await productmodel.findById(id);
    for (let imageid of imageinfo) {
      product.image.pull(imageid);
    }
    product.image = [...product.image, ...newupdateImage];
    await product.save();
    if (!product) {
      return res
        .status(500)
        .json(new apiError(500, null, null, `product update image Failed`));
    }
    return res
      .status(200)
      .json(new apiResponse(200, product, ` product iamge updated Sucessfull`));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          500,
          null,
          null,
          `product update image controller Error ${error}`
        )
      );
  }
};

module.exports = {
  createProduct,
  gelAllproducts,
  getSingleProduct,
  updateProductInformation,
  updateProductImage,
};
