// controllers/adminController.js
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Monitor Users
exports.monitorUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Monitor Chats
exports.monitorChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('users', 'username profilePicture');
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Monitor Messages
exports.monitorMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username profilePicture');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Manage User Roles
exports.manageUserRoles = async (req, res) => {
  const { userId, roles } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.roles = roles;
    await user.save();
    res.status(200).json({ message: 'User roles updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
