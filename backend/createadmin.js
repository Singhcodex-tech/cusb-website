require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const PortalUser = require('./models/PortalUser');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ DB connected');

    // Check if admin already exists
    const existing = await PortalUser.findOne({ username: 'admin@cusb.ac.in' });
    if (existing) {
      console.log('⚠️  Admin already exists. Deleting and recreating...');
      await PortalUser.deleteOne({ username: 'admin@cusb.ac.in' });
    }

    // Hash password
    const hash = await bcrypt.hash('Admin@1234', 12);

    // Create admin user
    await PortalUser.create({
      username: 'admin@cusb.ac.in',
      password: hash,
      role: 'admin',
      name: 'CUSB Administrator',
      email: 'admin@cusb.ac.in',
      initials: 'CA',
      prog: 'Administrative Section',
      sem: 'Administrator',
      authProvider: 'local'
    });

    console.log('✅ Admin user created successfully');
    console.log('   Username: admin@cusb.ac.in');
    console.log('   Password: Admin@1234');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 DB disconnected');
    process.exit(0);
  }
}

createAdmin();