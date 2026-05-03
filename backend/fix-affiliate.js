require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const fixAffiliate = async () => {
  try {
    await connectDB();

    const adminUser = await mongoose.connection.collection('users').findOne({ email: 'admin@aibusinessgenerator.com' });
    if (!adminUser) {
      console.log('Admin user not found!');
      process.exit(1);
    }

    // Check if affiliate already exists
    const existing = await mongoose.connection.collection('affiliates').findOne({ user: adminUser._id });
    if (existing) {
      console.log('Affiliate already exists!');
      process.exit(0);
    }

    await mongoose.connection.collection('affiliates').insertOne({
      user: adminUser._id,
      referralCode: adminUser.referralCode || 'ADMIN001',
      totalReferrals: 0,
      convertedReferrals: 0,
      earnings: 0,
      referrals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Affiliate document created for admin!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixAffiliate();
