// controllers/statusController.js
const emoji = require('node-emoji');
const Status = require('../models/Status');

exports.postStatus = async (req, res) => {
  const { content } = req.body;
  try {
    const status = new Status({
      user: req.user.userId,
      content
    });
    await status.save();
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStatusUpdates = async (req, res) => {
  try {
    const statuses = await Status.find().populate('user', 'username profilePicture').sort({ createdAt: -1 });
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.postStatusUpdate = async (req, res) => {
    const { status } = req.body;
    const userId = req.user.id;
  
    try {
      const statusWithEmojis = emoji.emojify(status);
      await User.findByIdAndUpdate(userId, { status: statusWithEmojis }, { new: true });
  
      res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
  };
  
