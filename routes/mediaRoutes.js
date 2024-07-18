const express = require('express');
const { getMediaGallery } = require('../controllers/mediaController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/gallery/:chatId', jwtMiddleware, getMediaGallery);

module.exports = router;
