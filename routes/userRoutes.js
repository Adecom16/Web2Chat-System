const express = require('express');
const {
  searchUsers,
  getUser,
  getFriends,
  updateProfile,
  updateProfileCustomization,
  updateStatusMessage,
  updateLastSeenOnlineStatus,
  updatePrivacySettings,
  reportUser,  // Add this line
  blockUser  
  // enableTwoFactorAuth,
  // verifyTwoFactorAuth
} = require('../controllers/userController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');
const router = express.Router();

// Search users by username
router.get('/search', jwtMiddleware, searchUsers);

// Get a user by ID
router.get('/:userId', jwtMiddleware, getUser);

// Get friends of the logged-in user
router.get('/friends', jwtMiddleware, getFriends);

// Update profile (username, email, status, profile picture)
router.put('/profile', jwtMiddleware, upload.single('profilePicture'), updateProfile);

// Update profile customization (theme, background)
router.put('/:userId/profile-customization', jwtMiddleware, updateProfileCustomization);

// Update status message
router.put('/:userId/status-message', jwtMiddleware, updateStatusMessage);

// Update last seen and online status
router.put('/:userId/online-status', jwtMiddleware, updateLastSeenOnlineStatus);

// Update privacy settings
router.put('/:userId/privacy-settings', jwtMiddleware, updatePrivacySettings);

// Enable two-factor authentication
// router.post('/:userId/enable-2fa', jwtMiddleware, enableTwoFactorAuth);

// Verify two-factor authentication
// router.post('/:userId/verify-2fa', jwtMiddleware, verifyTwoFactorAuth);
// Report user
router.post('/report', jwtMiddleware, reportUser);  // Add this line

// Block user
router.post('/block', jwtMiddleware, blockUser);    // Add this line


module.exports = router;
