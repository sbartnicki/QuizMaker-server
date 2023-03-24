require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const users = require('./routes/users');
const quizzes = require('./routes/quizzes');
const quizzesUserAnswers = require('./routes/quizzesUserAnswers'); // LUIZ
const auth = require('./routes/auth');
const resets = require('./routes/resets');
const mongoDbPass = process.env.DB_PASS;
const cors = require('cors');

mongoose
  .connect(
    `mongodb+srv://AdminUser:${mongoDbPass}@cluster1.lk3e6nd.mongodb.net/QuizMaker?retryWrites=true&w=majority`
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log(err.message));

app.use(cors());
app.use(express.json());
app.use('/api/users', users);
app.use('/api/quizzes', quizzes); 
app.use('/api/answers', quizzesUserAnswers);// LUIZ
app.use('/api/auth', auth);
app.use('/api/resets', resets);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log('Listening on port', port));
