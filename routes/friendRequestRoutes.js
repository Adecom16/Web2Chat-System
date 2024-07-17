const express = require('express');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require('../controllers/friendRequestController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/send', jwtMiddleware, sendFriendRequest);
router.post('/accept', jwtMiddleware, acceptFriendRequest);
router.post('/reject', jwtMiddleware, rejectFriendRequest);

module.exports = router;
