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

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     description: Create a new group.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', jwtMiddleware, createGroup);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   put:
 *     summary: Edit group
 *     description: Edit the details of an existing group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group edited.
 *       401:
 *         description: Unauthorized.
 */
router.put('/:groupId', jwtMiddleware, editGroup);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   delete:
 *     summary: Delete group
 *     description: Delete an existing group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group to delete
 *     responses:
 *       200:
 *         description: Group deleted.
 *       401:
 *         description: Unauthorized.
 */
router.delete('/:groupId', jwtMiddleware, deleteGroup);

/**
 * @swagger
 * /api/groups/{groupId}/members:
 *   post:
 *     summary: Add a member to a group
 *     description: Add a new member to an existing group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group to add member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member added.
 *       401:
 *         description: Unauthorized.
 */
router.post('/:groupId/members', jwtMiddleware, addMember);

/**
 * @swagger
 * /api/groups/{groupId}/members/{memberId}:
 *   delete:
 *     summary: Remove a member from a group
 *     description: Remove a member from an existing group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group to remove member
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the member to remove
 *     responses:
 *       200:
 *         description: Member removed.
 *       401:
 *         description: Unauthorized.
 */
router.delete('/:groupId/members/:memberId', jwtMiddleware, removeMember);

/**
 * @swagger
 * /api/groups/{groupId}/members/{memberId}/role:
 *   put:
 *     summary: Assign a role to a member
 *     description: Assign a role to a member within a group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role assigned.
 *       401:
 *         description: Unauthorized.
 */
router.put('/:groupId/members/:memberId/role', jwtMiddleware, assignRole);

/**
 * @swagger
 * /api/groups/{groupId}/invite:
 *   post:
 *     summary: Invite a user to a group
 *     description: Invite a user to join a group via email.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group to invite user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User invited.
 *       401:
 *         description: Unauthorized.
 */
router.post('/:groupId/invite', jwtMiddleware, inviteUser);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   get:
 *     summary: Get group details
 *     description: Fetch the details of a group by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: Group details retrieved.
 *       401:
 *         description: Unauthorized.
 */
router.get('/:groupId', jwtMiddleware, getGroupDetails);

module.exports = router;
