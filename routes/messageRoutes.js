const express = require('express');
const { sendMessage, getMessages, reactToMessage, removeReaction, markAsRead } = require('../controllers/messageController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');
const router = express.Router();

router.post('/send', jwtMiddleware, upload.single('file'), sendMessage);
router.get('/:chatId', jwtMiddleware, getMessages);
router.post('/react', jwtMiddleware, reactToMessage);
router.post('/remove-reaction', jwtMiddleware, removeReaction);
router.post('/mark-as-read', jwtMiddleware, markAsRead);

module.exports = router;
