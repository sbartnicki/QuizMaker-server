const mongoose = require('mongoose');
const Joi = require('joi');

const quizSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  created: { type: Date, default: Date.now },
  title: { type: String, required: true },
  questions: [Object],
});

const Quiz = mongoose.model('Quiz', quizSchema);

function validateQuiz(quiz) {
  const question = Joi.object().keys({
    type: Joi.string().valid('tf', 'mc').required(),
    question: Joi.string().min(1),
    options: Joi.array().items(
      Joi.object().keys({
        text: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      })
    ),
  });
  const schema = Joi.object({
    ownerId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    created: Joi.date(),
    title: Joi.string().min(1),
    questions: Joi.array().items(question),
  });

  return schema.validate(quiz);
}

exports.Quiz = Quiz;
exports.validateQuiz = validateQuiz;
