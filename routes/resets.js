const router = require('express').Router();
const { User, validateUser } = require('../models/user');
const { sendEmail, validateEmail } = require('../services/email');
const ResetToken = require('../models/resetToken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Endpoint for generating password reset link
router.post('/', async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("User with given e-mail doesn't exist");
  // Checking if user already requested the reset and deleting previous token if so
  let token = await ResetToken.findOne({ userId: user._id });
  if (token) await token.deleteOne();
  // Generating new token
  token = crypto.randomBytes(32).toString('hex');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(token, salt);

  await new ResetToken({
    userId: user._id,
    token: hash,
  }).save();

  const link = `https://quiz-maker-two.vercel.app/reset/${token}/${user._id}`;

  await sendEmail(req.body.email, link)
    .then(() => res.send('Reset email sent. Please check your mailbox'))
    .catch((err) => res.status(400).send(err.message));
});

// Endpoint for resetting the user password after he clicks the link
router.post('/password', async (req, res) => {
  const token = await ResetToken.findOne({ userId: req.body.userId });
  if (!token) return res.status(400).send('Invalid or expired password token');

  const isValid = await bcrypt.compare(req.body.token, token.token);
  if (!isValid)
    return res.status(400).send('Invalid or expired password token');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);
  const user = await User.findOneAndUpdate(
    { _id: req.body.userId },
    { $set: { password: hash } },
    { returnNewDocument: true }
  );

  token.deleteOne();

  if (user) {
    res.send('Password has been changed');
  } else {
    res.status(400).send("Couldn't update password");
  }
});

module.exports = router;
