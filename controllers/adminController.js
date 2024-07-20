// controllers/adminController.js
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Announcement = require('../models/Announcement');

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

// View and moderate content
exports.viewContent = async (req, res) => {
  try {
    const content = await Content.find();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.moderateContent = async (req, res) => {
  const { contentId, action } = req.body; // action could be 'approve' or 'delete'
  try {
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ error: 'Content not found' });

    if (action === 'delete') {
      await content.remove();
    } else {
      content.status = 'approved';
      await content.save();
    }
    res.status(200).json({ message: 'Content moderated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Send announcements
exports.sendAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  try {
    const announcement = new Announcement({ title, message });
    await announcement.save();
    // Broadcast announcement to all users
    req.io.emit('announcement', announcement);
    res.status(200).json({ message: 'Announcement sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Track and manage reports
exports.trackReports = async (req, res) => {
  try {
    const users = await User.find({ 'reports.0': { $exists: true } }).populate('reports.reportedBy', 'username email');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.blockUser = async (req, res) => {
  const { userId, blockedUserId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.blockedUsers.push(blockedUserId);
    await user.save();

    res.status(200).json({ message: 'User blocked successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.unblockUser = async (req, res) => {
  const { userId, blockedUserId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== blockedUserId);
    await user.save();

    res.status(200).json({ message: 'User unblocked successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
