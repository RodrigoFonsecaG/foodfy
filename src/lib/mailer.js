const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2078a32dce3378",
      pass: "2b24ca193e93f1"
    }
  });