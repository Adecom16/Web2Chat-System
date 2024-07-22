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
const moderateContent = require('../middlewares/contentModerationMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/messages/{messageId}/read:
 *   post:
 *     summary: Mark a message as read
 *     description: Mark a specific message as read.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID of the message to mark as read
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message marked as read.
 *       401:
 *         description: Unauthorized.
 */
router.post('/:messageId/read', jwtMiddleware, markMessageAsRead);

/**
 * @swagger
 * /api/messages/{messageId}/reactions:
 *   post:
 *     summary: React to a message
 *     description: Add a reaction to a specific message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID of the message to react to
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reaction:
 *                 type: string
 *                 description: The reaction emoji or text
 *     responses:
 *       200:
 *         description: Reaction added.
 *       401:
 *         description: Unauthorized.
 */
router.post('/:messageId/reactions', jwtMiddleware, reactToMessage);

/**
 * @swagger
 * /api/messages/{messageId}/reactions:
 *   delete:
 *     summary: Remove a reaction from a message
 *     description: Remove a specific reaction from a message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID of the message to remove reaction from
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Reaction removed.
 *       401:
 *         description: Unauthorized.
 */
router.delete('/:messageId/reactions', jwtMiddleware, removeReaction);

/**
 * @swagger
 * /api/messages/{messageId}:
 *   put:
 *     summary: Edit a message
 *     description: Edit the content of a specific message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID of the message to edit
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The new content of the message
 *     responses:
 *       200:
 *         description: Message edited.
 *       401:
 *         description: Unauthorized.
 */
router.put('/:messageId', jwtMiddleware, editMessage);

/**
 * @swagger
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     description: Delete a specific message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID of the message to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message deleted.
 *       401:
 *         description: Unauthorized.
 */
router.delete('/:messageId', jwtMiddleware, deleteMessage);

/**
 * @swagger
 * /api/messages/{messageId}/reply:
 *   post:
 *     summary: Reply to a message
 *     description: Reply to a specific message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID of the message to reply to
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The content of the reply
 *     responses:
 *       201:
 *         description: Reply sent.
 *       401:
 *         description: Unauthorized.
 */
router.post('/:messageId/reply', jwtMiddleware, replyToMessage);

/**
 * @swagger
 * /api/messages/search:
 *   get:
 *     summary: Search messages
 *     description: Search for messages within a chat.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *       - name: chatId
 *         in: query
 *         required: true
 *         description: The ID of the chat to search within
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Search results.
 *       401:
 *         description: Unauthorized.
 */
router.get('/search', jwtMiddleware, searchMessages);

/**
 * @swagger
 * /api/messages/{chatId}:
 *   get:
 *     summary: Get messages
 *     description: Retrieve all messages for a specific chat.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: ID of the chat to get messages from
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of messages.
 *       401:
 *         description: Unauthorized.
 */
router.get('/:chatId', jwtMiddleware, getMessages);

/**
 * @swagger
 * /api/messages/{messageId}/pin:
 *   post:
 *     summary: Pin a message
 *     description: Pin a specific message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID of the message to pin
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message pinned.
 *       401:
 *         description: Unauthorized.
 */
router.post('/:messageId/pin', jwtMiddleware, pinMessage);

/**
 * @swagger
 * /api/messages/{messageId}/unpin:
 *   post:
 *     summary: Unpin a message
 *     description: Unpin a specific message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: ID of the message to unpin
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Message unpinned.
 *       401:
 *         description: Unauthorized.
 */
router.post('/:messageId/unpin', jwtMiddleware, unpinMessage);

/**
 * @swagger
 * /api/messages/voice:
 *   post:
 *     summary: Send a voice message
 *     description: Send a voice message to a chat.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 format: uuid
 *               voiceMessage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Voice message sent.
 *       401:
 *         description: Unauthorized.
 */
router.post('/voice', jwtMiddleware, upload.single('voiceMessage'), sendVoiceMessage);

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message
 *     description: Send a new message to a chat.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the message
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be sent (optional)
 *               chatId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the chat to send the message to
 *     responses:
 *       201:
 *         description: Message sent.
 *       401:
 *         description: Unauthorized.
 */
router.post('/send', jwtMiddleware, moderateContent, sendMessage);

/**
 * @swagger
 * /api/messages/sync-drafts:
 *   post:
 *     summary: Sync drafts
 *     description: Sync message drafts for offline mode.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drafts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     chatId:
 *                       type: string
 *                       format: uuid
 *                     content:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Drafts synced.
 *       401:
 *         description: Unauthorized.
 */
router.post('/sync-drafts', jwtMiddleware, syncDrafts);

module.exports = router;
