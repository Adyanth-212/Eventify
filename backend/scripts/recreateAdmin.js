import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { connectDB } from '../config/db.js';

// Load environment variables
dotenv.config();

const recreateAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    const adminEmail = 'adyanthmallur@gmail.com';
    const adminName = 'Adyanth Mallur';
    const adminPassword = 'admin123';
    
    console.log(`🗑️ Removing existing admin user if exists...`);
    
    // First, completely remove the existing user
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      // Clean up their data
      await Event.deleteMany({ organizer: existingUser._id });
      await Registration.deleteMany({ user: existingUser._id });
      await User.findByIdAndDelete(existingUser._id);
      console.log(`✅ Existing user removed`);
    }
    
    console.log(`👤 Creating fresh admin user: ${adminName} (${adminEmail})`);
    
    // Hash password properly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Create completely new admin user
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword, // This should be included even with select: false during creation
      role: 'admin',
      bio: 'System Administrator with full access privileges',
      phone: '+1-555-ADMIN',
      profilePicture: 'data:image/svg+xml;base64,' + Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
          <rect width="120" height="120" fill="#dc2626"/>
          <text x="60" y="70" font-family="Arial" font-size="48" fill="white" text-anchor="middle" font-weight="bold">A</text>
        </svg>
      `).toString('base64')
    });
    
    await adminUser.save();
    
    // Verify the user was created with password
    const verifyUser = await User.findOne({ email: adminEmail }).select('+password');
    if (verifyUser && verifyUser.password) {
      const passwordMatch = await bcrypt.compare(adminPassword, verifyUser.password);
      console.log(`✅ Admin user created successfully!`);
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`🔐 Password verification: ${passwordMatch ? 'PASSED' : 'FAILED'}`);
      console.log(`🆔 User ID: ${verifyUser._id}`);
      console.log(`🔧 Role: ${verifyUser.role}`);
    } else {
      console.log(`❌ User created but password missing!`);
    }
    
    console.log(`🌐 You can now login at: http://localhost:5173/login`);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
recreateAdmin();