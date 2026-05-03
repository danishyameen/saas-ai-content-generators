const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Payment = require('../models/Payment');
const AIRequest = require('../models/AIRequest');
const Affiliate = require('../models/Affiliate');
const AdminLog = require('../models/AdminLog');
const { protect, admin } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect);
router.use(admin);

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isBanned: false });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const proUsers = await User.countDocuments({ plan: 'pro' });
    const enterpriseUsers = await User.countDocuments({ plan: 'enterprise' });
    const freeUsers = await User.countDocuments({ plan: 'free' });
    const totalAIRequests = await AIRequest.countDocuments();

    // Revenue calculation
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const stripeRevenue = payments
      .filter(p => p.method === 'stripe')
      .reduce((sum, p) => sum + p.amount, 0);
    const jazzcashRevenue = payments
      .filter(p => p.method === 'jazzcash')
      .reduce((sum, p) => sum + p.amount, 0);

    // Today's AI requests
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRequests = await AIRequest.countDocuments({ createdAt: { $gte: today } });

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');

    // Top affiliates
    const topAffiliates = await Affiliate.find()
      .sort({ totalReferrals: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers,
          byPlan: {
            free: freeUsers,
            pro: proUsers,
            enterprise: enterpriseUsers,
          },
        },
        revenue: {
          total: totalRevenue,
          stripe: stripeRevenue,
          jazzcash: jazzcashRevenue,
        },
        ai: {
          totalRequests: totalAIRequests,
          todayRequests: todayRequests,
        },
        recentUsers,
        topAffiliates,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, plan, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (plan) query.plan = plan;
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/ban
// @desc    Ban/unban a user
// @access  Admin
router.put('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    await AdminLog.create({
      admin: req.user._id,
      action: user.isBanned ? 'ban_user' : 'unban_user',
      target: user.email,
      details: `User ${user.isBanned ? 'banned' : 'unbanned'} by admin`,
    });

    res.json({
      success: true,
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Change user role
// @access  Admin
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    await AdminLog.create({
      admin: req.user._id,
      action: 'change_role',
      target: user.email,
      details: `Role changed to ${role}`,
    });

    res.json({ success: true, message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/plan
// @desc    Change user plan
// @access  Admin
router.put('/users/:id/plan', async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.plan = plan;
    await user.save();

    await AdminLog.create({
      admin: req.user._id,
      action: 'change_plan',
      target: user.email,
      details: `Plan changed to ${plan}`,
    });

    res.json({ success: true, message: 'Plan updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();

    // Clean up related data
    await AIRequest.deleteMany({ user: req.params.id });
    await Payment.deleteMany({ user: req.params.id });
    await Affiliate.deleteMany({ user: req.params.id });

    await AdminLog.create({
      admin: req.user._id,
      action: 'delete_user',
      target: user.email,
      details: 'User deleted by admin',
    });

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Admin
router.get('/payments', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, method } = req.query;
    const query = {};

    if (status) query.status = status;
    if (method) query.method = method;

    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/payments/:id/approve
// @desc    Approve JazzCash payment
// @access  Admin
router.put('/payments/:id/approve', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.method !== 'jazzcash') {
      return res.status(400).json({ success: false, message: 'Only JazzCash payments can be approved' });
    }

    payment.status = 'completed';
    payment.adminNotes = req.body.notes || 'Approved by admin';
    await payment.save();

    // Upgrade user plan
    const user = await User.findById(payment.user._id);
    user.plan = payment.plan;

    if (payment.plan === 'pro') {
      user.requestLimit = 100; // This is legacy, but we'll keep it consistent
      user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    } else if (payment.plan === 'enterprise') {
      user.requestLimit = 999999;
      user.planExpiresAt = new Date(Date.now() + 150 * 24 * 60 * 60 * 1000); // 150 days (5 months)
    }

    await user.save();

    // Update affiliate earnings
    if (user.referredBy) {
      const affiliate = await Affiliate.findOne({ referralCode: user.referredBy });
      if (affiliate) {
        affiliate.convertedReferrals += 1;
        affiliate.earnings += 5;
        const referrer = await User.findById(affiliate.user);
        if (referrer) {
          referrer.referralEarnings += 5;
          await referrer.save();
        }
        await affiliate.save();
      }
    }

    await AdminLog.create({
      admin: req.user._id,
      action: 'approve_payment',
      target: payment.user.email,
      details: `JazzCash payment approved: ${payment.jazzcashTransactionId}`,
    });

    res.json({ success: true, message: 'Payment approved and user upgraded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/payments/:id/reject
// @desc    Reject JazzCash payment
// @access  Admin
router.put('/payments/:id/reject', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    payment.status = 'failed';
    payment.adminNotes = req.body.notes || 'Rejected by admin';
    await payment.save();

    await AdminLog.create({
      admin: req.user._id,
      action: 'reject_payment',
      target: payment.user.email,
      details: `JazzCash payment rejected: ${payment.jazzcashTransactionId}`,
    });

    res.json({ success: true, message: 'Payment rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/ai-requests
// @desc    Get all AI requests
// @access  Admin
router.get('/ai-requests', async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const query = {};

    if (type) query.type = type;

    const requests = await AIRequest.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AIRequest.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/affiliates
// @desc    Get all affiliates
// @access  Admin
router.get('/affiliates', async (req, res) => {
  try {
    const affiliates = await Affiliate.find()
      .populate('user', 'name email plan')
      .sort({ totalReferrals: -1 });

    res.json({ success: true, data: affiliates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/logs
// @desc    Get admin activity logs
// @access  Admin
router.get('/logs', async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Admin
router.get('/analytics', async (req, res) => {
  try {
    // AI requests by type (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const aiRequestsByType = await AIRequest.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Daily signups (last 30 days)
    const dailySignups = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Revenue by day (last 30 days)
    const dailyRevenue = await Payment.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'completed' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        aiRequestsByType,
        dailySignups,
        dailyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
