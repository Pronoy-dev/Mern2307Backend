const nodemailer = require("nodemailer");
const { emailTemplate } = require("../helpers/emailTemplate");
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const SendMail = async (firstName, Otp, email) => {
  const info = await transporter.sendMail({
    from: "MERN 2307👻",
    to: email,
    subject: "Verification Email  ✔",
    html: emailTemplate(firstName, Otp ,email),
  });

  return info.messageId;
};

module.exports = { SendMail };
