const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
  },
  totalReferrals: {
    type: Number,
    default: 0,
  },
  convertedReferrals: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  referrals: [{
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    converted: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Affiliate', affiliateSchema);
