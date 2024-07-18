const User = require("../models/User");
const Report = require('../models/Report');

exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("friends", "-password");
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
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
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateProfileCustomization = async (req, res) => {
  const { userId } = req.params;
  const { theme, background } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { theme, background },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateStatusMessage = async (req, res) => {
  const { userId } = req.params;
  const { statusMessage } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { statusMessage },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateLastSeenOnlineStatus = async (req, res) => {
  const { userId } = req.params;
  const { online } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { online, lastSeen: Date.now() },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updatePrivacySettings = async (req, res) => {
  const { userId } = req.params;
  const { lastSeenVisibleTo, profilePictureVisibleTo, statusVisibleTo } =
    req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        privacySettings: {
          lastSeenVisibleTo,
          profilePictureVisibleTo,
          statusVisibleTo,
        },
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.reportUser = async (req, res) => {
  const { reportedUserId, reason } = req.body;
  const reporterUserId = req.user.userId;

  try {
    const report = new Report({
      reporter: reporterUserId,
      reported: reportedUserId,
      reason,
    });
    await report.save();
    res.status(201).json({ message: "User reported successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.blockUser = async (req, res) => {
  const { userIdToBlock } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    user.blockedUsers.push(userIdToBlock);
    await user.save();
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
