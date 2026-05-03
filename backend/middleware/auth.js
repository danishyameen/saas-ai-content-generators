const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      if (req.user.isBanned) {
        return res.status(403).json({ success: false, message: 'Your account has been banned. Contact support.' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};

const checkUsage = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user.canMakeRequest()) {
    let message = 'Limit reached. Upgrade your plan for more access.';
    if (user.plan !== 'free' && user.planExpiresAt && new Date() > user.planExpiresAt) {
      message = 'Your plan has expired. Please renew to continue.';
    }

    return res.status(429).json({
      success: false,
      message,
      limit: user.requestLimit,
      used: user.totalAIRequests,
      upgradeUrl: '/pricing',
    });
  }
  next();
};

module.exports = { protect, admin, checkUsage };
