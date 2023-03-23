const { User, validateUser } = require('../models/user');
const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();

  res.header('x-auth-token', token).send({
    email: user.email,
    message: 'Authenticated',
    id: user._id,
  });
});

module.exports = router;
