const Message = require('../models/Message');
const emoji = require('node-emoji');
const Chat = require('../models/Chat');
const { encrypt, decrypt } = require('../utils/encryption');
const { sendNotification } = require('../utils/notificationService');

exports.sendMessage = async (req, res) => {
  const { content, file, chatId } = req.body;
  try {
    const contentWithEmojis = emoji.emojify(content);
    const encryptedContent = content ? encrypt(contentWithEmojis) : null;
    // const encryptedContent = content ? encrypt(content) : null;
    const mentionedUsernames = content.match(/@\w+/g) || [];
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames.map(u => u.slice(1)) } });
    const message = new Message({
      sender: req.user.userId,
      content: encryptedContent ? encryptedContent.encryptedData : null,
      file: file ? file.path : null,
      chatId,
      mentions: mentionedUsers.map(user => user._id)
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

      // Send push notification to mentioned users
      mentionedUsers.forEach(user => {
        if (user._id.toString() !== req.user.userId) {
          sendNotification(user.fcmToken, {
            notification: {
              title: 'You were mentioned',
              body: content
            }
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

    const reactionWithEmoji = emoji.emojify(reaction.type);

    if (existingReaction) {
      existingReaction.type = reactionWithEmoji;
    } else {
      message.reactions.push({ userId, type: reactionWithEmoji });
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
    const reactionWithEmoji = emoji.emojify(reactionType);

    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId || r.type !== reactionWithEmoji);
    
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.userId;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

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

exports.replyToMessage = async (req, res) => {
  const { messageId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const newMessage = new Message({
      sender: userId,
      chatId: req.body.chatId,
      text,
      parentMessage: messageId
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.searchMessages = async (req, res) => {
  const { query, chatId } = req.query;

  try {
    const messages = await Message.find({
      chatId,
      text: { $regex: query, $options: 'i' }
    }).populate('sender', '-password');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.pinMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (message.sender.toString() !== userId) return res.status(403).json({ error: 'Unauthorized action' });

    message.pinned = true;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.unpinMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (message.sender.toString() !== userId) return res.status(403).json({ error: 'Unauthorized action' });

    message.pinned = false;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.sendVoiceMessage = async (req, res) => {
  const { chatId } = req.body;
  const sender = req.user.userId;
  const voiceMessageUrl = req.file.path;

  try {
    const message = new Message({
      chatId,
      sender,
      voiceMessage: voiceMessageUrl,
      messageType: 'voice'
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.syncDrafts = async (req, res) => {
  const { drafts } = req.body;
  try {
    const messages = drafts.map(draft => {
      return new Message({
        sender: draft.sender,
        chatId: draft.chatId,
        text: draft.text,
        media: draft.media,
        voiceMessage: draft.voiceMessage,
        messageType: draft.messageType,
        mentions: draft.mentions,
        parentMessage: draft.parentMessage
      });
    });
    const savedMessages = await Message.insertMany(messages);
    res.status(201).json(savedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
