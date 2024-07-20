const express = require('express');
const { shareLocation, getLocation } = require('../controllers/locationController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/share', jwtMiddleware, shareLocation);
router.get('/:chatId', jwtMiddleware, getLocation);

module.exports = router;
