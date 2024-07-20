const express = require('express');
const {
  markMessageAsRead,
  reactToMessage,
  removeReaction,
  editMessage,
  deleteMessage,
  replyToMessage,
  syncDrafts,
  searchMessages,
  sendMessage,
  getMessages,
  sendVoiceMessage,
  pinMessage,
  unpinMessage
} = require('../controllers/messageController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const moderateContent = require('../middlewares/contentModerationMiddleware'); // Add this line
const upload = require('../middlewares/fileUploadMiddleware');  // Ensure upload middleware is properly imported
const router = express.Router();

router.post('/:messageId/read', jwtMiddleware, markMessageAsRead);
router.post('/:messageId/reactions', jwtMiddleware, reactToMessage);
router.delete('/:messageId/reactions', jwtMiddleware, removeReaction);
router.put('/:messageId', jwtMiddleware, editMessage);
router.delete('/:messageId', jwtMiddleware, deleteMessage);
router.post('/:messageId/reply', jwtMiddleware, replyToMessage);
router.get('/search', jwtMiddleware, searchMessages);
router.get('/:chatId', jwtMiddleware, getMessages);
router.post('/:messageId/pin', jwtMiddleware, pinMessage);
router.post('/:messageId/unpin', jwtMiddleware, unpinMessage);
router.post('/voice', jwtMiddleware, upload.single('voiceMessage'), sendVoiceMessage);
router.post('/send', jwtMiddleware, moderateContent, sendMessage); // Add content moderation to message sending
router.post('/sync-drafts', jwtMiddleware, syncDrafts);

module.exports = router;
