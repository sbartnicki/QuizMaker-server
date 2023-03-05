const router = require('express').Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find();

  res.send(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).send("User with given ID doesn't exist");

  res.send(user);
});

router.post('/', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    creator: req.body.creator,
  });

  user = await user.save();

  res.send(user);
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
