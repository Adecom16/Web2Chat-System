const express = require('express');
const { createChat, getChats } = require('../controllers/chatController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', jwtMiddleware, createChat);
router.get('/', jwtMiddleware, getChats);

module.exports = router;
