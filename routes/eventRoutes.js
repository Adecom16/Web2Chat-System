const express = require('express');
const { createEvent, getEvents } = require('../controllers/eventController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', jwtMiddleware, createEvent);
router.get('/:chatId', jwtMiddleware, getEvents);

module.exports = router;
