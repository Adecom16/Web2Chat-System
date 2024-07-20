const Chat = require('../models/Chat');
const User = require('../models/User');

exports.createChat = async (req, res) => {
  const { participantId, isGroupChat, name, groupAdmins } = req.body;
  const userId = req.user.id;

  try {
    if (!isGroupChat) {
      const user = await User.findById(userId);
      if (!user.friends.includes(participantId)) return res.status(403).json({ error: 'User is not your friend' });

      const chat = new Chat({ users: [userId, participantId] });
      await chat.save();

      res.status(201).json(chat);
    } else {
      const chat = new Chat({ 
        name, 
        isGroupChat, 
        users: [userId, ...participantId], 
        groupAdmins: groupAdmins ? [userId, ...groupAdmins] : [userId] 
      });
      await chat.save();

      res.status(201).json(chat);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.getChats = async (req, res) => {
  const userId = req.user.id;

  try {
    const chats = await Chat.find({ users: userId })
      .populate('users', 'username email profilePicture')
      .populate('latestMessage')
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'sender',
          select: 'username profilePicture'
        }
      });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
