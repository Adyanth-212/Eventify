import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    const adminEmail = 'adyanthmallur@gmail.com';
    const adminName = 'Adyanth Mallur';
    const adminPassword = 'admin123'; // You can change this
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`👤 Admin user already exists: ${existingAdmin.name} (${existingAdmin.email})`);
      console.log(`🔧 Updating user with proper password and admin role...`);
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Update existing user to admin with proper password
      existingAdmin.role = 'admin';
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      
      console.log(`✅ User updated to admin successfully!`);
      console.log(`🔑 Password set to: ${adminPassword}`);
    } else {
      console.log(`👤 Creating new admin user: ${adminName} (${adminEmail})`);
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Create new admin user
      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
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
      console.log(`✅ Admin user created successfully!`);
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    }
    
    console.log(`🔧 Admin privileges granted!`);
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
createAdmin();