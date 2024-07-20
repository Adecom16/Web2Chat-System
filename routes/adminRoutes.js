// routes/adminRoutes.js
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

router.get('/users', jwtMiddleware, adminMiddleware, monitorUsers);
router.get('/chats', jwtMiddleware, adminMiddleware, monitorChats);
router.get('/messages', jwtMiddleware, adminMiddleware, monitorMessages);
router.post('/manage-roles', jwtMiddleware, adminMiddleware, manageUserRoles);
router.get('/content', jwtMiddleware, adminMiddleware, viewContent);
router.post('/moderate-content', jwtMiddleware, adminMiddleware, moderateContent);
router.post('/send-announcement', jwtMiddleware, adminMiddleware, sendAnnouncement);
router.get('/reports', jwtMiddleware, adminMiddleware, trackReports);
router.post('/block-user', jwtMiddleware, adminMiddleware, blockUser);
router.post('/unblock-user', jwtMiddleware, adminMiddleware, unblockUser);

module.exports = router;
