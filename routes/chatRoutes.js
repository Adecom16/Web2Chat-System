const express = require('express');
const { createChat } = require('../controllers/chatController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', jwtMiddleware, createChat);

module.exports = router;
