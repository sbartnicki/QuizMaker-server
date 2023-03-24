const router = require('express').Router();
const { QuizUserAnswers } = require('../models/quizUserAnswers');

router.get('/', async (req, res) => {
    const quizzesUserAnswers = await QuizUserAnswers.find();

    res.send(quizzesUserAnswers);
});


// #### Route for getting a specific quiz answers of a user by the quiz answers id. It must return one document ####
router.get('/:id', async (req, res) => {
    const quizzesUserAnswers = await QuizUserAnswers.findById(req.params.id);

    if (!quizzesUserAnswers) return res.send('There is no quiz answers for the user with such ID');

    res.send(quizzesUserAnswers);
}); 


// #### Route for inserting a new quiz answers of a user inside the quiz_user_answers collection ####
router.post('/', async (req, res) => {
   
   // if (error) return res.status(400).send(error.details[0].message);

    let quizzesUserAnswers = new QuizUserAnswers({
        quizId: req.body.quizId,
        userId: req.body.userId,
        questions: req.body.questions,
        score: req.body.score
    });

    quizzesUserAnswers = await quizzesUserAnswers.save();

    res.send(quizzesUserAnswers);
});

// #### Route for updating a new quiz answers of a user from the quiz_user_answers collection ####
router.put('/:id', async (req, res) => {
    const quizzesUserAnswers = await QuizUserAnswers.findByIdAndUpdate(
        req.params.id, 
        { quizId: req.body.quizId },
        { userId: req.body.userId },
        { questions: req.body.questions },
        { score: req.body.score },
        { new: true }
    );

    if (!quizzesUserAnswers) return res.status(404).send('The quiz answers with given ID doesnt exist');

    res.send(quizzesUserAnswers);
});

// #### Route for deleting a  quiz answers of a user from the quiz_user_answers collection ####
router.delete('/:id', async (req, res) => {
    const quizzesUserAnswers = await QuizUserAnswers.findByIdAndDelete(req.params.id);

    if (!quizzesUserAnswers) return res.status(404).send("Quiz with given ID doesn't exist");

    res.send(quizzesUserAnswers);
});

module.exports = router;