const router = require('express').Router();
const { User, validateUser } = require('../models/user');
const { Quiz } = require('../models/quiz');

router.get('/', async (req, res) => {
  const users = await User.find();

  res.send(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).send("User with given ID doesn't exist");

  res.send(user);
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("User with given e-mail doesn't exist");

  if (user.password === req.body.password) {
    const quizzes = await Quiz.find({ ownerId: user._id });
    res.send(quizzes);
  } else {
    res.send('Wrong password');
  }
});

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered');

  user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  user = await user.save();

  res.send({ user, message: 'User registered.' });
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
