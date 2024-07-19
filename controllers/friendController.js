// controllers/friendController.js
const Friend = require('../models/Friend');
const User = require('../models/User');

exports.addFriend = async (req, res) => {
  const { friendId } = req.body;
  try {
    const friendExists = await User.findById(friendId);
    if (!friendExists) return res.status(404).json({ error: 'User not found' });

    const newFriend = new Friend({
      user: req.user.userId,
      friend: friendId
    });
    await newFriend.save();
    res.status(201).json(newFriend);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({ user: req.user.userId }).populate('friend', 'username profilePicture');
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeFriend = async (req, res) => {
  const { friendId } = req.params;
  try {
    await Friend.findOneAndDelete({ user: req.user.userId, friend: friendId });
    res.status(200).json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
