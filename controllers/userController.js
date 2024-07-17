const User = require('../models/User');


exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('friends', '-password');
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  const { username, email, status } = req.body;
  const userId = req.user.id;
  const profilePicture = req.file ? req.file.path : null;

  try {
    const user = await User.findById(userId);
    if (username) user.username = username;
    if (email) user.email = email;
    if (status) user.status = status;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
