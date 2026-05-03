const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },
  stripeCustomerId: {
    type: String,
    default: null,
  },
  stripeSubscriptionId: {
    type: String,
    default: null,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  usageToday: {
    type: Number,
    default: 0,
  },
  requestLimit: {
    type: Number,
    default: 10,
  },
  planExpiresAt: {
    type: Date,
    default: null,
  },
  usageDate: {
    type: Date,
    default: Date.now,
  },
  companyDetails: {
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    website: { type: String, default: '' },
    phone: { type: String, default: '' },
    logo: { type: String, default: '' }, // URL or Base64
  },
  totalAIRequests: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: String,
    default: null,
  },
  referralCount: {
    type: Number,
    default: 0,
  },
  referralEarnings: {
    type: Number,
    default: 0,
  },
  resetPasswordOTP: {
    type: String,
    default: null,
    select: false,
  },
  resetPasswordOTPExpires: {
    type: Date,
    default: null,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = `REF${this.email.substring(0, 4).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.resetUsage = function () {
  const today = new Date();
  const usageDate = new Date(this.usageDate);
  if (today.toDateString() !== usageDate.toDateString()) {
    this.usageToday = 0;
    this.usageDate = today;
  }
};

userSchema.methods.canMakeRequest = function () {
  this.resetUsage();
  if (this.isBanned) return false;

  // Admin has unlimited access forever
  if (this.role === 'admin') return true;

  // Check if plan is expired (only for pro/enterprise users who are not admins)
  if (this.plan !== 'free' && this.planExpiresAt && new Date() > this.planExpiresAt) {
    return false;
  }

  // Check usage against daily limit based on plan
  let dailyLimit = 10; // Default for free
  if (this.plan === 'pro') dailyLimit = 100;
  if (this.plan === 'enterprise') dailyLimit = 999999;

  if (this.usageToday >= dailyLimit) {
    return false;
  }

  return true;
};

userSchema.methods.incrementUsage = function () {
  this.resetUsage();
  this.usageToday += 1;
  this.totalAIRequests += 1;
};

module.exports = mongoose.model('User', userSchema);
