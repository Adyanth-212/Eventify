import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';

// Load environment variables
dotenv.config();

const checkAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    const adminEmail = 'adyanthmallur@gmail.com';
    
    // Find the admin user
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log(`❌ Admin user with email ${adminEmail} not found`);
    } else {
      console.log(`✅ Admin user found:`);
      console.log(`📧 Email: ${admin.email}`);
      console.log(`👤 Name: ${admin.name}`);
      console.log(`🔧 Role: ${admin.role}`);
      console.log(`🆔 ID: ${admin._id}`);
      console.log(`📅 Created: ${admin.createdAt}`);
      console.log(`🔑 Has Password: ${admin.password ? 'Yes' : 'No'}`);
      
      // Test password hash
      const bcrypt = await import('bcryptjs');
      const passwordMatch = await bcrypt.default.compare('admin123', admin.password);
      console.log(`🔐 Password 'admin123' matches: ${passwordMatch ? 'Yes' : 'No'}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking admin:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
checkAdmin();