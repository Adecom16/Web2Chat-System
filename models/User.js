const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user']
  },
  
  statusMessage: {
    type: String
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  online: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'default'
  },
  background: {
    type: String,
    default: 'default'
  },
  privacySettings: {
    lastSeenVisibleTo: {
      type: String,
      enum: ['everyone', 'contacts', 'no one'],
      default: 'everyone'
    },
    profilePictureVisibleTo: {
      type: String,
      enum: ['everyone', 'contacts', 'no one'],
      default: 'everyone'
    },
    statusVisibleTo: {
      type: String,
      enum: ['everyone', 'contacts', 'no one'],
      default: 'everyone'
    },
    fcmToken: {
      type: String,
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
