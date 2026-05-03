/**
 * Seed script to create an admin user
 * Run: node backend/seed.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123456', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@aibusinessgenerator.com',
      password: hashedPassword,
      role: 'admin',
      plan: 'enterprise',
      isBanned: false,
      usageToday: 0,
      totalAIRequests: 0,
      referralCode: 'ADMIN001',
      referralCount: 0,
      referralEarnings: 0,
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@aibusinessgenerator.com');
    console.log('Password: admin123456');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
