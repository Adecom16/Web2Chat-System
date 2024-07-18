// models/Poll.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new Schema({
  question: String,
  options: [{ text: String, votes: Number }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Poll', PollSchema);
