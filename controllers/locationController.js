const Location = require('../models/Location');

exports.shareLocation = async (req, res) => {
  const { latitude, longitude, chatId } = req.body;
  const userId = req.user.id;

  try {
    const location = new Location({
      user: userId,
      chat: chatId,
      latitude,
      longitude,
    });
    await location.save();

    // Emit location to all clients in the chat room
    req.io.to(chatId).emit('locationUpdate', location);

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLocation = async (req, res) => {
  const { chatId } = req.params;

  try {
    const locations = await Location.find({ chat: chatId }).populate('user', 'username profilePicture');
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
