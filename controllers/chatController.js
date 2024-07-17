const Chat = require('../models/Chat');
const User = require('../models/User');

exports.createChat = async (req, res) => {
  const { participantId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user.friends.includes(participantId)) return res.status(403).json({ error: 'User is not your friend' });

    const chat = new Chat({ participants: [userId, participantId] });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getChats = async (req, res) => {
  const userId = req.user.id;

  try {
    const chats = await Chat.find({ users: userId })
      .populate('users', 'username email profilePicture')
      .populate('latestMessage');

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
