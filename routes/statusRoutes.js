// routes/statusRoutes.js
const express = require('express');
const { postStatus, getStatusUpdates } = require('../controllers/statusController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', jwtMiddleware, postStatus);
router.get('/', jwtMiddleware, getStatusUpdates);

module.exports = router;
