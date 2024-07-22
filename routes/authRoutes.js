const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  verifyToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Validation middleware
const registerValidation = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  check('profilePicture', 'Profile Picture URL is required').not().isEmpty(),
  check('statusMessage', 'Status Message is required').not().isEmpty(),
];

const loginValidation = [
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
];

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with a username, email, password, profile picture, and status message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: uri
 *               statusMessage:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request.
 */
router.post('/register', registerValidation, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Bad request.
 */
router.post('/login', loginValidation, login);

/**
 * @swagger
 * /api/auth/verify-token:
 *   get:
 *     summary: Verify JWT token
 *     description: Verify the JWT token for authentication.
 *     responses:
 *       200:
 *         description: Token is valid.
 *       401:
 *         description: Unauthorized.
 */
router.get('/verify-token', jwtMiddleware, verifyToken);

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify email with token
 *     description: Verify a user's email address using a token sent to their email.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Bad request.
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Send a forgot password email to the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Forgot password email sent.
 *       400:
 *         description: Bad request.
 */
router.post('/forgot-password', [check('email', 'Email is required').isEmail()], forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     description: Reset the user's password using a token sent to their email.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Bad request.
 */
router.post('/reset-password/:token', [check('password', 'Password is required').not().isEmpty()], resetPassword);

module.exports = router;
