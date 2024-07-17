const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { encrypt, decrypt } = require('../utils/encryption');
const { sendNotification } = require('../utils/notificationService');

exports.sendMessage = async (req, res) => {
  const { content, file, chatId } = req.body;
  try {
    const encryptedContent = content ? encrypt(content) : null;
    const message = new Message({
      sender: req.user.userId,
      content: encryptedContent ? encryptedContent.encryptedData : null,
      file,
      chatId,
    });
    await message.save();
    await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

    // Send push notification
    const chat = await Chat.findById(chatId).populate('users', 'fcmToken');
    chat.users.forEach((user) => {
      if (user._id.toString() !== req.user.userId) {
        sendNotification(user.fcmToken, {
          notification: {
            title: 'New Message',
            body: content || 'You have received a new file',
          },
        });
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId }).populate('sender', 'username profilePicture');
    const decryptedMessages = messages.map((msg) => {
      if (msg.content) {
        msg.content = decrypt({ iv: msg.content.iv, encryptedData: msg.content });
      }
      return msg;
    });
    res.status(200).json(decryptedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.reactToMessage = async (req, res) => {
  const { messageId, reaction } = req.body;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    const existingReaction = message.reactions.find(r => r.userId.toString() === userId);

    if (existingReaction) {
      existingReaction.type = reaction.type;
    } else {
      message.reactions.push({ userId, type: reaction.type });
    }

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.removeReaction = async (req, res) => {
  const { messageId, reactionType } = req.body;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId || r.type !== reactionType);
    
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.markAsRead = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }

};


exports.editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (message.sender.toString() !== userId) return res.status(403).json({ error: 'Unauthorized action' });

    message.text = text;
    message.edited = true;
    message.updatedAt = Date.now();
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};



exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (message.sender.toString() !== userId) return res.status(403).json({ error: 'Unauthorized action' });

    message.deleted = true;
    message.text = 'This message was deleted';
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
