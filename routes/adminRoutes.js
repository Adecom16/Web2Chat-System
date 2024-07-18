// routes/adminRoutes.js
const express = require('express');
const { monitorUsers, monitorChats, monitorMessages, manageUserRoles } = require('../controllers/adminController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

router.get('/users', jwtMiddleware, adminMiddleware, monitorUsers);
router.get('/chats', jwtMiddleware, adminMiddleware, monitorChats);
router.get('/messages', jwtMiddleware, adminMiddleware, monitorMessages);
router.post('/manage-roles', jwtMiddleware, adminMiddleware, manageUserRoles);

module.exports = router;
