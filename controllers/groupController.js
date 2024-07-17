const Group = require('../models/Group');
const User = require('../models/User');

// Create a new group
exports.createGroup = async (req, res) => {
  const { name, description, members } = req.body;
  const userId = req.user.userId; // Assuming the jwtMiddleware sets req.user

  try {
    // Validate members
    const users = await User.find({ '_id': { $in: members } });
    if (users.length !== members.length) {
      return res.status(400).json({ error: 'Invalid member IDs provided' });
    }

    // Check if group name is already taken
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ error: 'Group name already taken' });
    }

    // Create group
    const group = new Group({ name, description, members: [...members, userId], createdBy: userId });
    await group.save();

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get groups for the logged-in user
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.userId }).populate('members', 'username profilePicture status');
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
