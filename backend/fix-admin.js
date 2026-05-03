require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const fixAdmin = async () => {
  try {
    await connectDB();

    // Delete old admin first
    await mongoose.connection.collection('users').deleteMany({
      $or: [
        { email: 'admin@aibusinessgenerator.com' },
        { email: 'danishyameennew@gmail.com' }
      ]
    });

    // Create fresh admin with properly hashed password
    const hashedPassword = await bcrypt.hash('karachi33@', 10);

    await mongoose.connection.collection('users').insertOne({
      name: 'Danish Yameen',
      email: 'danishyameennew@gmail.com',
      password: hashedPassword,
      role: 'admin',
      plan: 'enterprise',
      isBanned: false,
      usageToday: 0,
      totalAIRequests: 0,
      referralCode: 'ADMINDAN001',
      referralCount: 0,
      referralEarnings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    });

    console.log('✅ Admin user fixed!');
    console.log('Email: danishyameennew@gmail.com');
    console.log('Password: karachi33@');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixAdmin();
