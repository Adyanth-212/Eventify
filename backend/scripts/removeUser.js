import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { connectDB } from '../config/db.js';

// Load environment variables
dotenv.config();

const removeUser = async () => {
  try {
    // Connect to database
    await connectDB();
    
    const targetEmail = 'adyanthmallur@gmail.com';
    
    // Find the user to remove
    const user = await User.findOne({ email: targetEmail });
    
    if (!user) {
      console.log(`❌ User with email ${targetEmail} not found`);
      process.exit(0);
    }
    
    console.log(`🔍 Found user: ${user.name} (${user.email})`);
    console.log(`📧 Role: ${user.role}`);
    console.log(`🆔 User ID: ${user._id}`);
    
    // Check for events created by this user
    const eventsCreated = await Event.find({ organizer: user._id });
    console.log(`📅 Events created by user: ${eventsCreated.length}`);
    
    // Check for registrations by this user
    const registrations = await Registration.find({ user: user._id });
    console.log(`🎟️ Registrations by user: ${registrations.length}`);
    
    // Remove user's registrations first
    if (registrations.length > 0) {
      console.log('🗑️ Removing user registrations...');
      
      // Update event registered counts
      for (const registration of registrations) {
        await Event.findByIdAndUpdate(registration.event, {
          $inc: { registeredCount: -1 },
          $pull: { attendees: user._id }
        });
      }
      
      // Remove all registrations
      await Registration.deleteMany({ user: user._id });
      console.log(`✅ Removed ${registrations.length} registrations`);
    }
    
    // Handle events created by this user
    if (eventsCreated.length > 0) {
      console.log('🗑️ Handling events created by user...');
      
      for (const event of eventsCreated) {
        // Remove all registrations for these events
        const eventRegistrations = await Registration.find({ event: event._id });
        await Registration.deleteMany({ event: event._id });
        
        // Remove event from other users' eventsRegistered arrays
        await User.updateMany(
          { eventsRegistered: event._id },
          { $pull: { eventsRegistered: event._id } }
        );
        
        console.log(`🗑️ Removing event: ${event.title} (${eventRegistrations.length} registrations deleted)`);
      }
      
      // Delete all events created by this user
      await Event.deleteMany({ organizer: user._id });
      console.log(`✅ Removed ${eventsCreated.length} events`);
    }
    
    // Remove user from other users' arrays (if any references exist)
    await User.updateMany({}, {
      $pull: { 
        eventsCreated: { $in: eventsCreated.map(e => e._id) },
        eventsRegistered: { $in: registrations.map(r => r.event) }
      }
    });
    
    // Finally, remove the user
    await User.findByIdAndDelete(user._id);
    
    console.log(`✅ Successfully removed user: ${user.name} (${user.email})`);
    console.log('🔄 Database cleanup completed');
    
  } catch (error) {
    console.error('❌ Error removing user:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
removeUser();