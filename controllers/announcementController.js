const Announcement = require('../models/Announcement');

exports.createAnnouncement = async (req, res) => {
  const { title, content, groupId } = req.body;

  try {
    const announcement = new Announcement({
      title,
      content,
      groupId,
      author: req.user.id
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
