const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');
    console.log('Auth middleware - Token value:', token);
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, "your-secret-key");
    console.log('Auth middleware - Token decoded:', decoded);
    
    const user = await User.findById(decoded.userId);
    console.log('Auth middleware - User found:', user ? 'Yes' : 'No');
    console.log('Auth middleware - User ID from token:', decoded.userId);
    
    if (!user) {
      console.log('Auth middleware - User not found in database');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    console.log('Auth middleware - User attached to request:', req.user._id);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;