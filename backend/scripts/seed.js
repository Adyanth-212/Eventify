// Seed script for Eventify
// Usage: npm run seed
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Event from '../models/Event.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing in environment. Aborting.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');

    // Clear existing sample data (optional)
    const existingUsers = await User.find({ email: { $in: ['organizer@example.com', 'attendee@example.com'] } }).lean();
    if (existingUsers.length) {
      console.log('ℹ️ Removing existing sample users');
      const ids = existingUsers.map(u => u._id);
      await Event.deleteMany({ organizer: { $in: ids } });
      await User.deleteMany({ _id: { $in: ids } });
    }

    // Create sample users
    const organizer = new User({
      name: 'Sample Organizer',
      email: 'organizer@example.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'organizer',
      bio: 'Organizer of awesome sample events.'
    });
    const attendee = new User({
      name: 'Sample Attendee',
      email: 'attendee@example.com',
      password: 'password123',
      role: 'attendee'
    });

    await organizer.save();
    await attendee.save();
    console.log('👥 Created sample users');

    // Create sample events
    const now = new Date();
    const day = 24 * 60 * 60 * 1000;

    const eventsData = [
      {
        title: 'Tech Innovations Summit',
        description: 'Dive into the latest emerging technologies shaping our future. Networking + panels.',
        category: 'conference',
        date: new Date(now.getTime() + 7 * day),
        time: '10:00',
        location: 'San Francisco, CA',
        capacity: 150,
        price: 49,
        tags: ['technology', 'innovation', 'networking'],
        organizer: organizer._id
      },
      {
        title: 'Hands-on React Workshop',
        description: 'A practical workshop building modern React apps with hooks and performance patterns.',
        category: 'workshop',
        date: new Date(now.getTime() + 3 * day),
        time: '09:30',
        location: 'Remote / Online',
        capacity: 60,
        price: 0,
        tags: ['react', 'javascript', 'frontend'],
        organizer: organizer._id
      },
      {
        title: 'Community Networking Night',
        description: 'Casual evening to meet professionals across different industries. Light refreshments served.',
        category: 'networking',
        date: new Date(now.getTime() + 14 * day),
        time: '18:00',
        location: 'New York, NY',
        capacity: 200,
        price: 15,
        tags: ['networking', 'career'],
        organizer: organizer._id
      }
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log(`📅 Inserted ${createdEvents.length} events`);

    // Update organizer's eventsCreated
    await User.findByIdAndUpdate(organizer._id, { $push: { eventsCreated: { $each: createdEvents.map(e => e._id) } } });
    console.log('🔗 Linked events to organizer');

    console.log('✅ Seed complete');
    console.log('Login with organizer@example.com / password123 or attendee@example.com / password123');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
