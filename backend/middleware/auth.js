const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('./logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    logger.debug('Auth middleware - Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      logger.warn('Auth middleware - No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug('Auth middleware - Token decoded successfully');
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      logger.warn('Auth middleware - User not found in database');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    logger.debug('Auth middleware - User authenticated:', user._id);
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;