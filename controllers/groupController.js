const Group = require('../models/Group');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

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

// Add a member with a role to a group
exports.addMemberWithRole = async (req, res) => {
  const { groupId } = req.params;
  const { userId, role } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    group.members.push({ user: userId, role });
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Invite a member to a group via email
exports.inviteToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { email } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const inviteCode = uuidv4();
    group.invitations.push({ email, inviteCode });
    await group.save();

    // Send the invite code via email (Email sending logic to be implemented)
    // Example using nodemailer can be provided if needed

    res.status(200).json({ inviteCode });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update group description
exports.updateGroupDescription = async (req, res) => {
  const { groupId } = req.params;
  const { description } = req.body;

  try {
    const group = await Group.findByIdAndUpdate(groupId, { description }, { new: true });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
