const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    }
  }],
  invitations: [{
    email: {
      type: String
    },
    inviteCode: {
      type: String,
      unique: true
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);
