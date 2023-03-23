const nodemailer = require('nodemailer');
const Joi = require('joi');
require('dotenv').config();
const emailPass = process.env.EMAIL_PASS;

async function sendEmail(email, link, confirmation) {
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
    text: `Here is a link to your password reset ${link}`,
    html: `<b>Here is a link to your password reset <a href='${link}'>Click Here</a></b>`,
  };

  if (confirmation) {
    emailContent = {
      from: '"QUIZ Maker" <quizmakerproject@outlook.com>',
      to: email,
      subject: 'Quiz Maker - Please confirm your account',
      text: `Please click the below link to confirm your account ${link}`,
      html: `<b>Please click the below link to confirm your account <a href='${link}'>Click Here</a></b>`,
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
