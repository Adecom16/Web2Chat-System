const express = require('express');
const {
  monitorUsers,
  monitorChats,
  monitorMessages,
  manageUserRoles,
  viewContent,
  moderateContent,
  sendAnnouncement,
  trackReports,
  blockUser,
  unblockUser
} = require('../controllers/adminController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Monitor users
 *     description: Retrieve a list of all users for monitoring.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users.
 *       401:
 *         description: Unauthorized.
 */
router.get('/users', jwtMiddleware, adminMiddleware, monitorUsers);

/**
 * @swagger
 * /api/admin/chats:
 *   get:
 *     summary: Monitor chats
 *     description: Retrieve a list of all chats for monitoring.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats.
 *       401:
 *         description: Unauthorized.
 */
router.get('/chats', jwtMiddleware, adminMiddleware, monitorChats);

/**
 * @swagger
 * /api/admin/messages:
 *   get:
 *     summary: Monitor messages
 *     description: Retrieve a list of all messages for monitoring.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages.
 *       401:
 *         description: Unauthorized.
 */
router.get('/messages', jwtMiddleware, adminMiddleware, monitorMessages);

/**
 * @swagger
 * /api/admin/manage-roles:
 *   post:
 *     summary: Manage user roles
 *     description: Assign or change roles of users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User role updated.
 *       401:
 *         description: Unauthorized.
 */
router.post('/manage-roles', jwtMiddleware, adminMiddleware, manageUserRoles);

/**
 * @swagger
 * /api/admin/content:
 *   get:
 *     summary: View content
 *     description: View user-generated content for moderation.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user-generated content.
 *       401:
 *         description: Unauthorized.
 */
router.get('/content', jwtMiddleware, adminMiddleware, viewContent);

/**
 * @swagger
 * /api/admin/moderate-content:
 *   post:
 *     summary: Moderate content
 *     description: Moderate user-generated content.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *                 format: uuid
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *     responses:
 *       200:
 *         description: Content moderated.
 *       401:
 *         description: Unauthorized.
 */
router.post('/moderate-content', jwtMiddleware, adminMiddleware, moderateContent);

/**
 * @swagger
 * /api/admin/send-announcement:
 *   post:
 *     summary: Send announcement
 *     description: Send an announcement to all users or specific groups.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               targetGroups:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Announcement sent.
 *       401:
 *         description: Unauthorized.
 */
router.post('/send-announcement', jwtMiddleware, adminMiddleware, sendAnnouncement);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Track reports
 *     description: Retrieve and track user reports.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports.
 *       401:
 *         description: Unauthorized.
 */
router.get('/reports', jwtMiddleware, adminMiddleware, trackReports);

/**
 * @swagger
 * /api/admin/block-user:
 *   post:
 *     summary: Block a user
 *     description: Block a user from the application.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: User blocked.
 *       401:
 *         description: Unauthorized.
 */
router.post('/block-user', jwtMiddleware, adminMiddleware, blockUser);

/**
 * @swagger
 * /api/admin/unblock-user:
 *   post:
 *     summary: Unblock a user
 *     description: Unblock a user previously blocked.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: User unblocked.
 *       401:
 *         description: Unauthorized.
 */
router.post('/unblock-user', jwtMiddleware, adminMiddleware, unblockUser);

module.exports = router;
