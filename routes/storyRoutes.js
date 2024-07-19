const express = require("express");
const { jwtMiddleware } = require("../middlewares/authMiddleware");
const {
  postStory,
  reactToStory,
  viewStory,
  getStories,
  deleteStory,
} = require("../controllers/storyController");
const upload = require("../middlewares/fileUploadMiddleware");

const router = express.Router();

router.post("/", jwtMiddleware, upload.single("story"), postStory);
router.post("/:storyId/reactions", jwtMiddleware, reactToStory);
router.get("/:storyId/view", jwtMiddleware, viewStory);
router.get("/", jwtMiddleware, getStories);
router.delete("/:storyId", jwtMiddleware, deleteStory);

module.exports = router;
