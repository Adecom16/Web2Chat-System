const express = require('express');
const {
  searchUsers,
  getUser,
  getFriends,
  updateProfile,
  updateProfileCustomization,
  updateStatusMessage,
  updateLastSeenOnlineStatus,
  updatePrivacySettings,
  reportUser,  // Add this line
  blockUser  
  // enableTwoFactorAuth,
  // verifyTwoFactorAuth
} = require('../controllers/userController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users by username
 *     description: Search users by their username.
 *     responses:
 *       200:
 *         description: A list of users.
 *       401:
 *         description: Unauthorized.
 */
router.get('/search', jwtMiddleware, searchUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user's profile by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     responses:
 *       200:
 *         description: User profile.
 *       401:
 *         description: Unauthorized.
 */
router.get('/:userId', jwtMiddleware, getUser);

/**
 * @swagger
 * /api/users/friends:
 *   get:
 *     summary: Get friends of the logged-in user
 *     description: Retrieve a list of friends for the logged-in user.
 *     responses:
 *       200:
 *         description: A list of friends.
 *       401:
 *         description: Unauthorized.
 */
router.get('/friends', jwtMiddleware, getFriends);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update profile
 *     description: Update the profile information (username, email, status, profile picture) of the logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated.
 *       401:
 *         description: Unauthorized.
 */
router.put('/profile', jwtMiddleware, upload.single('profilePicture'), updateProfile);

/**
 * @swagger
 * /api/users/{userId}/profile-customization:
 *   put:
 *     summary: Update profile customization
 *     description: Update profile customization options (theme, background).
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               background:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile customization updated.
 *       401:
 *         description: Unauthorized.
 */
router.put('/:userId/profile-customization', jwtMiddleware, updateProfileCustomization);

/**
 * @swagger
 * /api/users/{userId}/status-message:
 *   put:
 *     summary: Update status message
 *     description: Update the status message of the logged-in user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusMessage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status message updated.
 *       401:
 *         description: Unauthorized.
 */
router.put('/:userId/status-message', jwtMiddleware, updateStatusMessage);

/**
 * @swagger
 * /api/users/{userId}/online-status:
 *   put:
 *     summary: Update last seen and online status
 *     description: Update the last seen and online status of the logged-in user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lastSeen:
 *                 type: string
 *                 format: date-time
 *               onlineStatus:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Online status updated.
 *       401:
 *         description: Unauthorized.
 */
router.put('/:userId/online-status', jwtMiddleware, updateLastSeenOnlineStatus);

/**
 * @swagger
 * /api/users/{userId}/privacy-settings:
 *   put:
 *     summary: Update privacy settings
 *     description: Update the privacy settings of the logged-in user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showLastSeen:
 *                 type: boolean
 *               showProfilePicture:
 *                 type: boolean
 *               showStatus:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Privacy settings updated.
 *       401:
 *         description: Unauthorized.
 */
router.put('/:userId/privacy-settings', jwtMiddleware, updatePrivacySettings);

/**
 * @swagger
 * /api/users/report:
 *   post:
 *     summary: Report user
 *     description: Report a user for inappropriate behavior or content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportedUserId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User reported.
 *       401:
 *         description: Unauthorized.
 */
router.post('/report', jwtMiddleware, reportUser);

/**
 * @swagger
 * /api/users/block:
 *   post:
 *     summary: Block user
 *     description: Block a user to prevent them from interacting with you.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blockedUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User blocked.
 *       401:
 *         description: Unauthorized.
 */
router.post('/block', jwtMiddleware, blockUser);

module.exports = router;
