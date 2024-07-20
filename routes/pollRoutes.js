const express = require('express');
const { createPoll, votePoll, getPolls } = require('../controllers/pollController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', jwtMiddleware, createPoll);
router.post('/vote', jwtMiddleware, votePoll);
router.get('/:chatId', jwtMiddleware, getPolls);

module.exports = router;
