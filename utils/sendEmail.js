import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (email, subject, message) {
  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: process.env.SMTP_USERNAME,
  //     pass: process.env.SMTP_PASSWORD,
  //   },
  // });

  // http://localhost:3000/reset-password/7ba15d7eeca68dc46a29b6d050a3200fd31f0cec


  const transportOptions = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    }
  }




  const transporter = nodemailer.createTransport(transportOptions);

  // send mail with defined transport object
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL, // sender address
    to: email, // user email
    subject: subject, // Subject line
    html: message, // html body
  });
};

export default sendEmail;
