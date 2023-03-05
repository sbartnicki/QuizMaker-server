const nodemailer = require('nodemailer');
const Joi = require('joi');
require('dotenv').config();
const emailPass = process.env.EMAIL_PASS;

async function sendEmail(email, confirmation) {
  // create reusable transporter object
  let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'quizmakerproject@outlook.com',
      pass: emailPass,
    },
  });

  let emailContent = {
    from: '"QUIZ Maker" <quizmakerproject@outlook.com>',
    to: email,
    subject: 'Quiz Maker Forgotten password link',
    text: 'Here is a link to your password reset FAKE LINK (to update in SPRINT 2)',
    html: '<b>Here is a link to your password reset FAKE LINK (to update in SPRINT 2)</b>',
  };

  if (confirmation) {
    emailContent = {
      from: '"QUIZ Maker" <quizmakerproject@outlook.com>',
      to: email,
      subject: 'Quiz Maker - Please confirm your account',
      text: 'Please click the below link to confirm your account FAKE LINK (to update in SPRINT 2)',
      html: '<b>Please click the below link to confirm your account FAKE LINK (to update in SPRINT 2)</b>',
    };
  }

  // send mail with defined transport object
  let info = await transporter.sendMail(emailContent);
}

function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().max(255).required().email(),
  });

  return schema.validate(email);
}

exports.sendEmail = sendEmail;
exports.validateEmail = validateEmail;
