const jwt = require('jsonwebtoken');

exports.jwtMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token is not valid' });

    req.user = { id: decoded.id };
    next();
  });
};
