const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  created: { type: Date, default: Date.now },
  title: { type: String, required: true },
  questions: [Object],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
