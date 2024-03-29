const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // This is used for make it not spam when sending email
    tls: {
      rejectUnauthorized: false,
    },
  });
  console.log(options);
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    html: `
    <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f2f2f2;
    }
    .header {
      background-color: #fff;
      padding: 10px 20px;
      text-align: center;
      border-bottom: 1px solid #ddd;
    }
    .logo {
      width: 100px; /* Adjust as per your logo's dimensions */
    }
    .container {
      background-color: #fff;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .title {
      color: #333;
      font-size: 26px;
      text-align: center;
      margin-bottom: 20px;
    }
    .content {
      line-height: 1.5;
      color: #666;
      margin-bottom: 30px;
      text-align: center;
    }
    .button {
      background-color: #004A7F;
      color: white !important;
      font-family: 'Arial', sans-serif;
      font-size: 16px;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    
    .button:hover {
      background-color: #003559; /* A darker shade of the button color for hover effect */
    }
    .footer {
      text-align: center;
      color: #999;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
  </head>
  <body>
  
  
  <div class="container">
    <div class="title">
      Tech TITAN
    </div>
  
    <div class="content">
      <p>Hi! ${options.user}</p>
      <h3>${options.message}</h3>
      <a href="${options.url}" class="button">${options.button}</a>
      <p>If you didn't request a password reset, you can ignore this email. Your password will not be changed.</p>
    </div>
  
    <div class="footer">
      Thank you for using the app.
    </div>
  </div>  
  
  </body>
  </html>
  `,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
