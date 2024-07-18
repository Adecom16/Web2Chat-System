const express = require('express');
const {
  createGroup,
  getGroups,
  addMemberWithRole,
  inviteToGroup,
  updateGroupDescription
} = require('../controllers/groupController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new group
router.post('/create', jwtMiddleware, createGroup);

// Get groups for the logged-in user
router.get('/', jwtMiddleware, getGroups);

// Add a member with a role to a group
router.post('/:groupId/add-member', jwtMiddleware, addMemberWithRole);

// Invite a member to a group via email
router.post('/:groupId/invite', jwtMiddleware, inviteToGroup);

// Update group description
router.put('/:groupId/description', jwtMiddleware, updateGroupDescription);

module.exports = router;
