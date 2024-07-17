const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

exports.sendFriendRequest = async (req, res) => {
  const { recipientId } = req.body;
  const requesterId = req.user.id;

  try {
    const existingRequest = await FriendRequest.findOne({ requester: requesterId, recipient: recipientId });
    if (existingRequest) return res.status(400).json({ error: 'Friend request already sent' });

    const friendRequest = new FriendRequest({ requester: requesterId, recipient: recipientId });
    await friendRequest.save();

    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = req.user.id;

  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (friendRequest.recipient.toString() !== userId) return res.status(403).json({ error: 'Unauthorized action' });

    friendRequest.status = 'accepted';
    await friendRequest.save();

    const requester = await User.findById(friendRequest.requester);
    const recipient = await User.findById(friendRequest.recipient);

    requester.friends.push(recipient._id);
    recipient.friends.push(requester._id);

    await requester.save();
    await recipient.save();

    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = req.user.id;

  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (friendRequest.recipient.toString() !== userId) return res.status(403).json({ error: 'Unauthorized action' });

    friendRequest.status = 'rejected';
    await friendRequest.save();

    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
