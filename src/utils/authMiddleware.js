// function authMiddleware(req, res, next) {
//     if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });
//     next();
//   }
  
// module.exports = authMiddleware;
  
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}

module.exports = authMiddleware;