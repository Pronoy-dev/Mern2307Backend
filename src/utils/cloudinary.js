const cloudinary = require("cloudinary").v2;
const fs = require("fs");
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRECT,
});
const uploadFileCloudinary = async (localFilePath) => {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localFilePath);
    if (uploadResult) {
      fs.unlinkSync(localFilePath);
    }
    return uploadResult;
  } catch (error) {
    console.log("Error from uploadFileCloudinary method", error);
  }
};


const delteCloudinaryImage = async (cloudinaryPath) => {
  try {
    if (!cloudinaryPath) {
      console.log("cloudinary Path Missing ")
    }
    return await cloudinary.api
      .delete_resources([cloudinaryPath],
        { type: 'upload', resource_type: 'image' })



  } catch (error) {
    console.log('Error from cloudinary delteImage function', error);
  }
}

module.exports = { uploadFileCloudinary, delteCloudinaryImage };
