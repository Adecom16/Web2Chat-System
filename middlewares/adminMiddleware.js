// middlewares/adminMiddleware.js
const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user && user.roles.includes('admin')) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied, admin only' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = adminMiddleware;
