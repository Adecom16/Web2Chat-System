const Group = require('../models/Group');
const User = require('../models/User');
const { sendGroupInviteEmail } = require('../utils/emailService');

exports.createGroup = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    const group = new Group({
      name,
      description,
      members: [{ user: userId, role: 'admin' }],
    });
    await group.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.editGroup = async (req, res) => {
  const { groupId } = req.params;
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isAdmin = group.members.some(
      (member) => member.user.toString() === userId && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized action' });

    group.name = name || group.name;
    group.description = description || group.description;
    group.updatedAt = Date.now();
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isAdmin = group.members.some(
      (member) => member.user.toString() === userId && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized action' });

    await group.remove();

    res.status(200).json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addMember = async (req, res) => {
  const { groupId } = req.params;
  const { userId, role } = req.body;
  const adminId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isAdmin = group.members.some(
      (member) => member.user.toString() === adminId && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized action' });

    const isMemberAlready = group.members.some(
      (member) => member.user.toString() === userId
    );
    if (isMemberAlready)
      return res.status(400).json({ error: 'User already a member' });

    group.members.push({ user: userId, role: role || 'member' });
    group.updatedAt = Date.now();
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeMember = async (req, res) => {
  const { groupId, memberId } = req.params;
  const adminId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isAdmin = group.members.some(
      (member) => member.user.toString() === adminId && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized action' });

    group.members = group.members.filter(
      (member) => member.user.toString() !== memberId
    );
    group.updatedAt = Date.now();
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.assignRole = async (req, res) => {
  const { groupId, memberId } = req.params;
  const { role } = req.body;
  const adminId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isAdmin = group.members.some(
      (member) => member.user.toString() === adminId && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized action' });

    const member = group.members.find(
      (member) => member.user.toString() === memberId
    );
    if (!member) return res.status(404).json({ error: 'Member not found' });

    member.role = role;
    group.updatedAt = Date.now();
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.inviteUser = async (req, res) => {
  const { groupId } = req.params;
  const { email } = req.body;
  const adminId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isAdmin = group.members.some(
      (member) => member.user.toString() === adminId && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized action' });

    await sendGroupInviteEmail(email, group);

    res.status(200).json({ message: 'Invitation sent' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getGroupDetails = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate('members.user', 'username email profilePicture');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
