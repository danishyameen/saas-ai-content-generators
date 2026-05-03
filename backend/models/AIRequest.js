const mongoose = require('mongoose');

const aiRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'product-generator',
      'seo-generator',
      'ads-generator',
      'business-ideas',
      'social-content',
      'competitor-analysis',
      'logo-generation',
      'image-generation',
      'marketing-campaign'
    ],
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  tokensUsed: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AIRequest', aiRequestSchema);
