const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
  const { question, options, chatId } = req.body;
  const userId = req.user.id;

  try {
    const poll = new Poll({
      question,
      options,
      chat: chatId,
      createdBy: userId,
    });
    await poll.save();

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.votePoll = async (req, res) => {
  const { pollId, optionIndex } = req.body;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPolls = async (req, res) => {
  const { chatId } = req.params;

  try {
    const polls = await Poll.find({ chat: chatId });
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
