const Message = require('../models/Message');

exports.getMediaGallery = async (req, res) => {
  const { chatId } = req.params;

  try {
    const mediaMessages = await Message.find({
      chatId,
      messageType: { $in: ['image', 'video', 'file'] }
    });

    res.status(200).json(mediaMessages);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
