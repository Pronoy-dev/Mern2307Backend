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
const { makeHaspassword, compareHashpassword } = require("../helpers/brypt");
const registration = async (req, res) => {
  try {
    const {
      firstName,
      email,
      phoneNumber,
      adress1,
      password,
      lastName,
      adress2,
    } = req.body;
    if (!firstName || !email || !phoneNumber || !adress1 || !password) {
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

    // now save the userinformation into database
    const saveUserInfo = await userModel.create({
      firstName,
      email,
      phoneNumber,
      adress1,
      password: haspassword,
      ...(lastName && { lastName }),
      ...(adress2 && { adress2: adress2 }),
    });

    // make a otp generator
    const Otp = otpgenerator();
    // send a verification mail
    const messageId = await SendMail(firstName, Otp, email);
    if (messageId) {
      const updatedUser = await userModel
        .findOneAndUpdate(
          { email: email },
          {
            otp: Otp,
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
      return res
        .status(500)
        .json(new apiError(500, null, null, `login Sucessfull`));
    }
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, null, null, `login controller Error : ${error}`));
  }
};

module.exports = { registration, login };
