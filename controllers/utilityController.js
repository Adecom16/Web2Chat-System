// controllers/utilityController.js
const Event = require('../models/Event');
const Poll = require('../models/Poll');
const User = require('../models/User');

// Share Location
exports.shareLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    // Logic to save location data (e.g., in a message)
    res.status(200).json({ message: 'Location shared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Schedule Event
exports.scheduleEvent = async (req, res) => {
  const { title, description, date, reminder, participants } = req.body;
  const createdBy = req.user.userId;
  try {
    const event = new Event({ title, description, date, reminder, createdBy, participants });
    await event.save();
    res.status(201).json({ message: 'Event scheduled successfully', event });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create Poll
exports.createPoll = async (req, res) => {
  const { question, options } = req.body;
  const createdBy = req.user.userId;
  try {
    const poll = new Poll({ question, options, createdBy });
    await poll.save();
    res.status(201).json({ message: 'Poll created successfully', poll });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Participate in Poll
exports.participateInPoll = async (req, res) => {
  const { pollId } = req.params;
  const { optionIndex } = req.body;
  const userId = req.user.userId;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    poll.options[optionIndex].votes += 1;
    poll.participants.push(userId);
    await poll.save();
    res.status(200).json({ message: 'Vote recorded successfully', poll });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Calendar Integration
exports.integrateCalendar = async (req, res) => {
  const { calendarService, eventData } = req.body;
  try {
    // Logic to integrate with calendar services like Google Calendar, Outlook, etc.
    res.status(200).json({ message: 'Event added to calendar successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
