const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Affiliate = require('../models/Affiliate');
const { protect } = require('../middleware/auth');

// @route   GET /api/affiliates/dashboard
// @desc    Get affiliate dashboard data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user._id })
      .populate('referrals.referredUser', 'name email plan createdAt');

    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const referralLink = `${process.env.FRONTEND_URL}/register?ref=${req.user.referralCode}`;

    res.json({
      success: true,
      data: {
        ...affiliate.toObject(),
        referralLink,
        referralCode: req.user.referralCode,
        referralEarnings: req.user.referralEarnings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/affiliates/leaderboard
// @desc    Get affiliate leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Affiliate.find()
      .populate('user', 'name email')
      .sort({ totalReferrals: -1 })
      .limit(50)
      .select('user totalReferrals convertedReferrals earnings');

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/affiliates/stats
// @desc    Get affiliate stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user._id });

    if (!affiliate) {
      return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    }

    const conversionRate = affiliate.totalReferrals > 0
      ? ((affiliate.convertedReferrals / affiliate.totalReferrals) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        totalReferrals: affiliate.totalReferrals,
        convertedReferrals: affiliate.convertedReferrals,
        conversionRate: `${conversionRate}%`,
        earnings: affiliate.earnings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
