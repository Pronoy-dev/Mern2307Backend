const emailTemplate = (firstName, otp ,email) => {
  return `
<html lang="en">
<head>
<style>
    body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            background-color: #ffffff;
            padding: 20px;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333333;
        }
        p {
            color: #555555;
            font-size: 16px;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            background-color: #f1f1f1;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
        }
        .footer {
            font-size: 14px;
            color: #888888;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Hello ${firstName},</h2>
        <p>Thank you for your request. Please use the following code to verify your account:</p>
        <p class="code">${otp}</p>
        <p>This code will expire in [time period, e.g., 10 minutes]. If you did not request this code, please ignore this email or contact our support team.</p>

        <div class="footer">
            <p>Best regards,<br></p>
            <button>
                <a href="${process.env.FRONTEND_DOMAIN}/otpverify/${email}" target= "_blank" >Click </a>
            </button>
        </div>
    </div>
</body>
</html>
`;
};

module.exports = { emailTemplate };
