const router = require('express').Router();
const { Quiz, validateQuiz } = require('../models/quiz');

router.get('/', async (req, res) => {
  const quizzes = await Quiz.find();

  res.send(quizzes);
});

router.get('/:id', async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) return res.send('There is no quiz with such ID');

  res.send(quiz);
});

router.post('/', async (req, res) => {
  const { error } = validateQuiz(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let quiz = new Quiz({
    title: req.body.title,
    ownerId: req.body.ownerId,
    questions: req.body.questions,
  });

  quiz = await quiz.save();

  res.send(quiz);
});

router.put('/:id', async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true }
  );

  if (!quiz) return res.status(404).send('The quiz with given ID doesnt exist');

  res.send(quiz);
});

router.delete('/:id', async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);

  if (!quiz) return res.status(404).send("Quiz with given ID doesn't exist");

  res.send(quiz);
});

module.exports = router;
