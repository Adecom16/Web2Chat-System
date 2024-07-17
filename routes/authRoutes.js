const express = require('express');
const { check } = require('express-validator');
const { register, login, verifyToken } = require('../controllers/authController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Validation middleware
const registerValidation = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  check('profilePicture', 'Profile Picture URL is required').not().isEmpty(),
  check('status', 'Status is required').not().isEmpty(),
];

const loginValidation = [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/verify-token', jwtMiddleware, verifyToken);

module.exports = router;
