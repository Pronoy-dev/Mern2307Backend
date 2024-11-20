const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const SendMail = async () => {
  const info = await transporter.sendMail({
    from: "MERN 2307👻",
    to: "taufik.cit.bd@gmail.com",
    subject: "Verification Email  ✔",

    html: `
        <h1>hello </h1>
        <button> Click </button>
        `,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = { SendMail };
