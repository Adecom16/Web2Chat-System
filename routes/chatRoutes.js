const express = require('express');
const { createChat, getChats } = require('../controllers/chatController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/chats/create:
 *   post:
 *     summary: Create a new chat
 *     description: Create a new chat between users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of user IDs participating in the chat.
 *     responses:
 *       201:
 *         description: Chat created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 */
router.post('/create', jwtMiddleware, createChat);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chats
 *     description: Retrieve all chats for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of chats.
 *       401:
 *         description: Unauthorized.
 */
router.get('/', jwtMiddleware, getChats);

module.exports = router;
