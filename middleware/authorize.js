const jwt = require('jsonwebtoken');

function authorize(requiredPrivileges) {
  return (req, res, next) => {
    const token = req.headers['x-auth-token'];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!requiredPrivileges.includes(decoded.admin.privilege)) {
        return res
          .status(403)
          .json({ message: 'Access denied. Insufficient privileges.' });
      }

      req.admin = decoded;

      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
}

module.exports = authorize;
