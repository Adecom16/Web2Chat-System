const express = require('express');
const { searchUsers, getUser, getFriends, updateProfile } = require('../controllers/userController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');
const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
router.get('/search', jwtMiddleware, searchUsers);
router.get('/:userId', jwtMiddleware, getUser);
router.get('/friends', jwtMiddleware, getFriends);
router.post('/update-profile', jwtMiddleware, upload.single('profilePicture'), updateProfile);

module.exports = router;
