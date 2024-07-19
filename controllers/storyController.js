const Story = require('../models/Story');
const emoji = require('node-emoji');

// Post a new story
exports.postStory = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const story = new Story({
      user: userId,
      content: emoji.emojify(content)
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    console.error('Error posting story:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// React to a story
exports.reactToStory = async (req, res) => {
  const { storyId, reaction } = req.body;
  const userId = req.user.id;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const existingReaction = story.reactions.find(r => r.userId.toString() === userId);
    const reactionWithEmoji = emoji.emojify(reaction);

    if (existingReaction) {
      existingReaction.type = reactionWithEmoji;
    } else {
      story.reactions.push({ userId, type: reactionWithEmoji });
    }

    await story.save();
    res.status(200).json(story);
  } catch (error) {
    console.error('Error reacting to story:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// View a story
exports.viewStory = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user.id;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (!story.views.includes(userId)) {
      story.views.push(userId);
      await story.save();
    }

    res.status(200).json(story);
  } catch (error) {
    console.error('Error viewing story:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all stories
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate('user', 'username profilePicture');
    res.status(200).json(stories);
  } catch (error) {
    console.error('Error getting stories:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a story
exports.deleteStory = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user.id;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.user.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    await story.remove();
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
