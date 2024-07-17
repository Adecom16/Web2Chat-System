const express = require('express');
const { createGroup, getGroups } = require('../controllers/groupController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', jwtMiddleware, createGroup);
router.get('/', jwtMiddleware, getGroups);

module.exports = router;
