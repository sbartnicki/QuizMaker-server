const router = require('express').Router();
const { User, validateUser } = require('../models/user');
const VerifyToken = require('../models/verifyToken');
const { sendEmail, validateEmail } = require('../services/email');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const crypto = require('crypto');
const { isValidObjectId } = require('mongoose');

// Route so user can get his data
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// Route for verifying user after clicking confirmation email
router.post('/verify', async (req, res) => {
  const objectId = isValidObjectId(req.body.userId);
  if (!objectId) {
    return res.status(400).send('Invalid object id');
  }
  const token = await VerifyToken.findOne({ userId: req.body.userId });
  if (!token) return res.status(400).send('Invalid email verification token');

  const isValid = await bcrypt.compare(req.body.token, token.token);
  if (!isValid) return res.status(400).send('Invalid email verification token');

  console.log('passed');
  const user = await User.findOneAndUpdate(
    { _id: token.userId },
    { $set: { isActive: true } },
    { returnNewDocument: true }
  );

  if (user) {
    res.send('Email confirmed!');
    token.deleteOne();
  }
});

// User registration, returns token in the header and details in body
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered');

  user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  // Hashing the password before saving the user to the DB
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();
  const token = user.generateAuthToken();

  // Generating  verification token
  const verifyToken = await new VerifyToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString('hex'),
  });

  const link = `https://quiz-maker-two.vercel.app/verify/${verifyToken.token}/${verifyToken.userId}`;

  verifyToken.token = await bcrypt.hash(verifyToken.token, salt);
  await verifyToken.save();

  await sendEmail(req.body.email, link, true) // Set second parameter to true if this is confirmation email
    .then(() =>
      res.header('x-auth-token', token).send({
        message: 'User registered. Confirmation email sent.',
        email: user.email,
        id: user._id,
      })
    )
    .catch((err) => res.status(400).send(err.message));
});

router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!user) return res.status(404).send("User with given ID doesn't exist");

  res.send(user);
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return res.status(404).send("User with given ID doesn't exist");

  res.send(user);
});

module.exports = router;
