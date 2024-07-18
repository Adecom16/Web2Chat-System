const badWords = ['kill', 'rape', 'motherfucker']; // Replace with actual bad words

const moderateContent = (req, res, next) => {
  const { content } = req.body;
  if (content) {
    const containsBadWords = badWords.some(word => content.includes(word));
    if (containsBadWords) {
      return res.status(400).json({ error: 'Content contains inappropriate language' });
    }
  }
  next();
};

module.exports = moderateContent;
