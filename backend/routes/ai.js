const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const AIService = require('../services/aiService');
const AIRequest = require('../models/AIRequest');
const User = require('../models/User');
const { protect, checkUsage } = require('../middleware/auth');

// Helper to process AI request
const processAIRequest = async (req, res, type) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { prompt } = req.body;
    const user = await User.findById(req.user._id);

    // Check usage limits
    if (!user.canMakeRequest()) {
      return res.status(429).json({
        success: false,
        message: 'Daily limit reached. Upgrade to Pro for unlimited access.',
        limit: user.plan === 'free' ? 10 : (user.plan === 'pro' ? 100 : 999999),
        used: user.usageToday,
      });
    }

    // Generate AI response
    const result = await AIService.generate(type, prompt);

    // Increment user usage
    user.incrementUsage();
    await user.save();

    // Save AI request
    await AIRequest.create({
      user: user._id,
      type,
      prompt,
      response: result.data,
    });

    res.json({
      success: true,
      data: result.data,
      usage: {
        used: user.usageToday,
        limit: user.plan === 'free' ? 10 : (user.plan === 'pro' ? 100 : 'unlimited'),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/ai/product-generator
// @desc    Generate product descriptions
// @access  Private
router.post('/product-generator', protect, checkUsage, [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
], (req, res) => processAIRequest(req, res, 'product-generator'));

// @route   POST /api/ai/seo-generator
// @desc    Generate SEO content
// @access  Private
router.post('/seo-generator', protect, checkUsage, [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
], (req, res) => processAIRequest(req, res, 'seo-generator'));

// @route   POST /api/ai/ads-generator
// @desc    Generate ad copy
// @access  Private
router.post('/ads-generator', protect, checkUsage, [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
], (req, res) => processAIRequest(req, res, 'ads-generator'));

// @route   POST /api/ai/business-ideas
// @desc    Generate business ideas
// @access  Private
router.post('/business-ideas', protect, checkUsage, [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
], (req, res) => processAIRequest(req, res, 'business-ideas'));

// @route   POST /api/ai/social-content
// @desc    Generate social media content
// @access  Private
router.post('/social-content', protect, checkUsage, [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
], (req, res) => processAIRequest(req, res, 'social-content'));

// @route   POST /api/ai/competitor-analysis
// @desc    Generate competitor analysis
// @access  Private
router.post('/competitor-analysis', protect, checkUsage, [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
], (req, res) => processAIRequest(req, res, 'competitor-analysis'));

// @route   POST /api/ai/marketing-campaign
// @desc    Generate marketing campaign
// @access  Private
router.post('/marketing-campaign', protect, checkUsage, [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
], async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.canMakeRequest()) {
      return res.status(429).json({
        success: false,
        message: 'Limit reached. Upgrade your plan for more access.',
      });
    }

    const result = await AIService.generateMarketingCampaign(prompt);

    user.incrementUsage();
    await user.save();

    await AIRequest.create({
      user: user._id,
      type: 'marketing-campaign',
      prompt,
      response: result,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/ai/generate-images
// @desc    Generate product images
// @access  Private
router.post('/generate-images', protect, checkUsage, [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
], async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = await User.findById(req.user._id);

    const images = await AIService.generateImages(prompt, 4, user.companyDetails);

    user.incrementUsage();
    await user.save();

    await AIRequest.create({
      user: user._id,
      type: 'image-generation',
      prompt,
      response: images,
    });

    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/ai/generate-logo
// @desc    Generate company logo options
// @access  Private
router.post('/generate-logo', protect, checkUsage, [
  body('brandName').trim().notEmpty().withMessage('Brand name is required'),
], async (req, res) => {
  try {
    const { brandName, industry } = req.body;
    const user = await User.findById(req.user._id);

    const logoOptions = await AIService.generateLogo(brandName, industry);

    user.incrementUsage();
    await user.save();

    await AIRequest.create({
      user: user._id,
      type: 'logo-generation',
      prompt: brandName,
      response: logoOptions,
    });

    res.json({ success: true, data: logoOptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/ai/templates
// @desc    Get marketing templates
// @access  Private
router.get('/templates', protect, async (req, res) => {
  try {
    const result = await AIService.generateTemplates();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/ai/history
// @desc    Get user's AI request history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const query = { user: req.user._id };
    if (type) query.type = type;

    const requests = await AIRequest.find(query)
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

// @route   DELETE /api/ai/history/:id
// @desc    Delete an AI request
// @access  Private
router.delete('/history/:id', protect, async (req, res) => {
  try {
    const request = await AIRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    await request.deleteOne();
    res.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
