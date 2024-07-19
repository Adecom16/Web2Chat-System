const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' }, // Story expires after 24 hours
  views: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  reactions: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String } // Use emoji type for reactions
  }]
});

module.exports = mongoose.model('Story', StorySchema);
