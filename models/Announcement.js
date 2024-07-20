const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
