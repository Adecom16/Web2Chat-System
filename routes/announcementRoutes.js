const express = require('express');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const { createAnnouncement, getAnnouncements } = require('../controllers/announcementController');
const router = express.Router();

router.post('/', jwtMiddleware, createAnnouncement);
router.get('/', jwtMiddleware, getAnnouncements);

module.exports = router;
