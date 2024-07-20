const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  const { title, description, startTime, endTime, chatId, reminders } = req.body;

  try {
    const event = new Event({
      title,
      description,
      startTime,
      endTime,
      chat: chatId,
      reminders,
    });
    await event.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEvents = async (req, res) => {
  const { chatId } = req.params;

  try {
    const events = await Event.find({ chat: chatId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
