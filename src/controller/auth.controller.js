const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const userModel = require("../model/user.model");
const {
  emailChecker,
  passwordCheker,
  bdNumberChecker,
} = require("../utils/cheker");
const { otpgenerator } = require("../helpers/OtpGenerator");
const { SendMail } = require("../helpers/nodemailer");
const { GenerateToken } = require("../helpers/JwtToken")
const { makeHaspassword, compareHashpassword } = require("../helpers/brypt");
const usermodel = require("../model/user.model");
// Cookie options
const options = {
  httpOnly: true, // Prevent client-side JavaScript access
  secure: false, // Set to true if using HTTPS
 
  };
const registration = async (req, res) => {
  try {
    const {
      firstName,
      email,
      phoneNumber,
      password,
    } = req.body;
    if (!firstName || !email || !phoneNumber || !password) {
      return res
        .status(401)
        .json(new apiError(401, null, null, `User Credential Missing`));
    }

    if (
      !emailChecker(email) ||
      !passwordCheker(password) ||
      !bdNumberChecker(phoneNumber)
    ) {
      return res
        .status(401)
        .json(
          new apiError(
            401,
            null,
            null,
            `User Email/password or phone number format invalid `
          )
        );
    }

    // check isAlreadyExistuser in database
    const isAlreadyExistuser = await userModel.find({
      $or: [
        { firstName: firstName },
        { email: email },
        { phoneNumber: phoneNumber },
      ],
    });
    if (isAlreadyExistuser?.length) {
      return res
        .status(401)
        .json(
          new apiError(
            401,
            null,
            null,
            `Already Exist in user Try another Email `
          )
        );
    }
    const haspassword = await makeHaspassword(password);


    // make a otp generator
    const Otp = otpgenerator();
    // send a verification mail
    const messageId = await SendMail(firstName, Otp, email);
    if (messageId) {
      // now save the userinformation into database
      const saveUserInfo = await userModel.create({
        firstName,
        email,
        phoneNumber,
        password: haspassword,

      });

      const updatedUser = await userModel
        .findOneAndUpdate(
          { email: email },
          {
            otp: Otp,
            otpExpireDate: new Date().getTime() + 30 * 60 * 1000,
          },
          {
            new: true,
          }
        )
        .select("-email -phoneNumber -password -role -createdAt -otp");
      return res
        .status(200)
        .json(
          new apiResponse(200, "Registraion Sucessfull", updatedUser, false)
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(500, null, null, `Registraion controller Error : ${error}`)
      );
  }
};

// login controller
const login = async (req, res) => {
  try {
    const { eamilOrphoneNumber, password } = req.body;
    if (!eamilOrphoneNumber || !password) {
      return res
        .status(400)
        .json(new apiError(400, null, null, `Email or password Invalid`));
    }

    // check is email / phone number is correct or not
    const checkisRegistredUser = await userModel.findOne({
      $or: [{ email: eamilOrphoneNumber }, { phoneNumber: eamilOrphoneNumber }],
    });

    if (checkisRegistredUser) {
      const passwordIsCorrect = await compareHashpassword(
        password,
        checkisRegistredUser.password
      );
      if (!passwordIsCorrect) {
        return res
          .status(400)
          .json(
            new apiError(400, null, null, `password Does not Match try Agin`)
          );
      }
      const userInfo = { _id: checkisRegistredUser._id, firstName: checkisRegistredUser.firstName, email: checkisRegistredUser.email, phoneNumber: checkisRegistredUser.phoneNumber }
      const token = await GenerateToken(userInfo);
      return res
        .status(200)
        .cookie('token', token , options)
        .json(new apiError(200, null, { data: { token: `Bearer ${token}`, checkisRegistredUser } }, `login Sucessfull`));
    }
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, null, null, `login controller Error : ${error}`));
  }
};

// const verifyOtp controller 
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
  

    if (!email || !otp) {
      return res
        .status(404)
        .json(new apiError(400, null, null, `email or otp Invalid`));
    }

    // check the given otp to the database
    const matchOtp = await userModel.findOne({ email: email });

    if (matchOtp.otpExpireDate >= new Date().getTime() && matchOtp.otp == parseInt(otp)) {
  

      const removeOtpCredential = await userModel.findOneAndUpdate({ email }, {
        otp: null,
        otpExpireDate: null
      },
        { new: true })
      if (removeOtpCredential) {
        return res
          .status(200)
          .json(new apiError(200,  `Otp Verified done` , null , false));
      }

    }else{
      const removeOtpCredential = await userModel.findOneAndUpdate({ email }, {
        otp: null,
        otpExpireDate: null
      },
        { new: true })
      if (removeOtpCredential) {
        return res
          .status(201)
          .json(new apiError(201, null, null, `Otp does't match  or time expired`));
      }
      return res
          .status(401)
          .json(new apiError(401, null, null, `Otp does't match  or time expired`));
    }



  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, null, null, `verifyOtp controller Error : ${error}`));
  }
}


// reset opt
const resendOpt = async (req,res)=> {
  try {
    const {email} = req.body;

    // find the user
    const user = await usermodel.findOne({email})
    if(!user){
      return res
      .status(401)
      .json(new apiError(401, null, null, `user email not found`));
    }
    
    // make a otp generator
    const Otp = otpgenerator();
    // send a verification mail
    const messageId = await SendMail(`${user.firstName} Here Is Your RESEND OPT`, Otp, email);
    if (messageId) {
     

     await userModel
        .findOneAndUpdate(
          { email:user.email },
          {
            otp: Otp,
            otpExpireDate: new Date().getTime() + 30 * 60 * 1000,
          },
          {
            new: true,
          }
        )
        .select("-email -phoneNumber -password -role -createdAt -otp");
        return res
          .status(201)
          .json(new apiResponse(201, `Otp Resend sucessfull` ,null, false));
    }
    
  } catch (error) {
    return res
    .status(500)
    .json(new apiError(500, null, null, `resent opt controller Error : ${error}`));
  }
}
module.exports = { registration, login, verifyOtp ,resendOpt };
