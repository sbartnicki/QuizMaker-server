const mongoose = require('mongoose');

const quizUserAnswersSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  userId: { type: String, required: true },
  questions: [Object],
  score: { type: Number, required: true },
});

const QuizUserAnswers = mongoose.model('quiz_User_Answers', quizUserAnswersSchema);

exports.QuizUserAnswers = QuizUserAnswers;
