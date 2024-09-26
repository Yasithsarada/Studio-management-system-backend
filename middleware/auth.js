const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require('dotenv').config();

exports.verifyAuth = asyncHandler(async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token'); // This retrieves the token from the request header named x-auth-token.

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin;
    // console.log('+++++++++++++++++++++++++++++++',req.admin);
    next();
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(401).json({ message: 'Token is not valid',err });
  }
});

