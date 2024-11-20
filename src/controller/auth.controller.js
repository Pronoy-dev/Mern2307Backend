const { apiResponse } = require("../utils/ApiResponse");
const { apiError } = require("../utils/ApiError");
const userModel = require("../model/user.model");
const {
  emailChecker,
  passwordCheker,
  bdNumberChecker,
} = require("../utils/cheker");
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

    // now save the userinformation into database
    const saveUserInfo = await userModel.create({
      firstName,
      email,
      phoneNumber,
      adress1,
      password,
      ...(lastName && { lastName }),
      ...(adress2 && { adress2: adress2 }),
    });

    // send a verification mail
    await SendMail();

    return res
      .status(200)
      .json(
        new apiResponse(200, "Registraion Sucessfull", saveUserInfo, false)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(500, null, null, `Registraion controller Error : ${error}`)
      );
  }
};

module.exports = { registration };
