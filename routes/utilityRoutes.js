// routes/utilityRoutes.js
const express = require('express');
const { shareLocation, scheduleEvent, createPoll, participateInPoll, integrateCalendar } = require('../controllers/utilityController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/location', jwtMiddleware, shareLocation);
router.post('/event', jwtMiddleware, scheduleEvent);
router.post('/poll', jwtMiddleware, createPoll);
router.post('/poll/:pollId/participate', jwtMiddleware, participateInPoll);
router.post('/calendar', jwtMiddleware, integrateCalendar);

module.exports = router;
