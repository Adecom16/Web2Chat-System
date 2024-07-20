const express = require('express');
const {
  createGroup,
  editGroup,
  deleteGroup,
  addMember,
  removeMember,
  assignRole,
  inviteUser,
  getGroupDetails,
} = require('../controllers/groupController');
const { jwtMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', jwtMiddleware, createGroup);
router.put('/:groupId', jwtMiddleware, editGroup);
router.delete('/:groupId', jwtMiddleware, deleteGroup);
router.post('/:groupId/members', jwtMiddleware, addMember);
router.delete('/:groupId/members/:memberId', jwtMiddleware, removeMember);
router.put('/:groupId/members/:memberId/role', jwtMiddleware, assignRole);
router.post('/:groupId/invite', jwtMiddleware, inviteUser);
router.get('/:groupId', jwtMiddleware, getGroupDetails);

module.exports = router;
