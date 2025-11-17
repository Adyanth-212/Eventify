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

// Sample base64 placeholder images (small colored squares)
const images = {
  tech: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%234a90e2"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E💻 Tech%3C/text%3E%3C/svg%3E',
  workshop: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23e67e22"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🛠️ Workshop%3C/text%3E%3C/svg%3E',
  networking: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%239b59b6"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🤝 Networking%3C/text%3E%3C/svg%3E',
  music: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23e74c3c"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🎵 Music%3C/text%3E%3C/svg%3E',
  sports: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%2327ae60"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E⚽ Sports%3C/text%3E%3C/svg%3E',
  art: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23f39c12"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🎨 Art%3C/text%3E%3C/svg%3E',
  food: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23d35400"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🍕 Food%3C/text%3E%3C/svg%3E',
  conference: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%2334495e"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E📊 Conference%3C/text%3E%3C/svg%3E'
};

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing in environment. Aborting.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');

    // Clear existing sample data
    const sampleEmails = [
      'john.organizer@eventify.com', 'sarah.events@eventify.com', 'mike.tech@eventify.com', 'emily.organizer@eventify.com',
      'david.events@eventify.com', 'lisa.arts@eventify.com', 'robert.business@eventify.com', 'jen.wellness@eventify.com',
      'alex.attendee@eventify.com', 'emma.user@eventify.com', 'chris.attendee@eventify.com', 'sophia.user@eventify.com',
      'james.attendee@eventify.com', 'olivia.user@eventify.com', 'daniel.attendee@eventify.com', 'isabella.user@eventify.com',
      'matt.attendee@eventify.com', 'ava.user@eventify.com', 'ryan.attendee@eventify.com', 'mia.user@eventify.com',
      'kevin.attendee@eventify.com', 'charlotte.user@eventify.com', 'tyler.attendee@eventify.com', 'amelia.user@eventify.com',
      'brandon.attendee@eventify.com'
    ];
    const existingUsers = await User.find({ email: { $in: sampleEmails } }).lean();
    if (existingUsers.length) {
      console.log(`ℹ️ Removing existing sample data (${existingUsers.length} users)`);
      const ids = existingUsers.map(u => u._id);
      await Event.deleteMany({ organizer: { $in: ids } });
      await User.deleteMany({ _id: { $in: ids } });
    }

    // Create multiple users (25 total: 8 organizers, 17 attendees)
    const users = [];
    
    // Organizers
    const organizers = [
      { name: 'John Smith', email: 'john.organizer@eventify.com', bio: 'Tech event organizer with 5+ years experience', phone: '+1-555-0101' },
      { name: 'Sarah Johnson', email: 'sarah.events@eventify.com', bio: 'Community builder and event planner', phone: '+1-555-0102' },
      { name: 'Michael Chen', email: 'mike.tech@eventify.com', bio: 'Software architect and conference speaker', phone: '+1-555-0103' },
      { name: 'Emily Rodriguez', email: 'emily.organizer@eventify.com', bio: 'Marketing professional and workshop facilitator', phone: '+1-555-0104' },
      { name: 'David Wilson', email: 'david.events@eventify.com', bio: 'Sports event coordinator and fitness enthusiast', phone: '+1-555-0105' },
      { name: 'Lisa Thompson', email: 'lisa.arts@eventify.com', bio: 'Arts and culture event curator', phone: '+1-555-0106' },
      { name: 'Robert Kim', email: 'robert.business@eventify.com', bio: 'Business networking and startup mentor', phone: '+1-555-0107' },
      { name: 'Jennifer Lopez', email: 'jen.wellness@eventify.com', bio: 'Wellness retreat organizer and yoga instructor', phone: '+1-555-0108' }
    ];

    // Attendees
    const attendees = [
      { name: 'Alex Martinez', email: 'alex.attendee@eventify.com' },
      { name: 'Emma Davis', email: 'emma.user@eventify.com' },
      { name: 'Chris Brown', email: 'chris.attendee@eventify.com' },
      { name: 'Sophia Taylor', email: 'sophia.user@eventify.com' },
      { name: 'James Anderson', email: 'james.attendee@eventify.com' },
      { name: 'Olivia White', email: 'olivia.user@eventify.com' },
      { name: 'Daniel Garcia', email: 'daniel.attendee@eventify.com' },
      { name: 'Isabella Miller', email: 'isabella.user@eventify.com' },
      { name: 'Matthew Wilson', email: 'matt.attendee@eventify.com' },
      { name: 'Ava Johnson', email: 'ava.user@eventify.com' },
      { name: 'Ryan Moore', email: 'ryan.attendee@eventify.com' },
      { name: 'Mia Jackson', email: 'mia.user@eventify.com' },
      { name: 'Kevin Lee', email: 'kevin.attendee@eventify.com' },
      { name: 'Charlotte Clark', email: 'charlotte.user@eventify.com' },
      { name: 'Tyler Harris', email: 'tyler.attendee@eventify.com' },
      { name: 'Amelia Lewis', email: 'amelia.user@eventify.com' },
      { name: 'Brandon Walker', email: 'brandon.attendee@eventify.com' }
    ];

    // Create organizers
    for (const org of organizers) {
      const user = new User({
        name: org.name,
        email: org.email,
        password: 'password123',
        role: 'organizer',
        bio: org.bio,
        phone: org.phone
      });
      await user.save();
      users.push(user);
    }

    // Create attendees
    for (const att of attendees) {
      const user = new User({
        name: att.name,
        email: att.email,
        password: 'password123',
        role: 'attendee'
      });
      await user.save();
      users.push(user);
    }

    const organizerUsers = users.slice(0, 8);
    console.log(`👥 Created ${users.length} users (${organizerUsers.length} organizers, ${attendees.length} attendees)`);

    // Create diverse sample events (18 events total)
    const now = new Date();
    const day = 24 * 60 * 60 * 1000;

    const eventsData = [
      // John Smith's events (3 events - tech focused)
      {
        title: 'AI & Machine Learning Summit 2025',
        description: 'Join industry leaders as we explore the cutting edge of artificial intelligence and machine learning. Keynote speakers from top tech companies, hands-on workshops, and networking opportunities.',
        category: 'conference',
        date: new Date(now.getTime() + 30 * day),
        time: '09:00',
        location: 'San Francisco Convention Center, CA',
        capacity: 500,
        price: 299,
        image: images.tech,
        tags: ['AI', 'machine-learning', 'technology', 'innovation'],
        organizer: organizerUsers[0]._id
      },
      {
        title: 'React Masterclass: Advanced Patterns',
        description: 'Deep dive into advanced React patterns including custom hooks, render props, compound components, and performance optimization techniques.',
        category: 'workshop',
        date: new Date(now.getTime() + 10 * day),
        time: '10:00',
        location: 'Remote / Online',
        capacity: 100,
        price: 0,
        image: images.workshop,
        tags: ['react', 'javascript', 'frontend', 'web-development'],
        organizer: organizerUsers[0]._id
      },
      {
        title: 'DevOps Summit 2024 (Past Event)',
        description: 'This event already happened! Great talks on CI/CD, containerization, and cloud infrastructure.',
        category: 'conference',
        date: new Date(now.getTime() - 60 * day),
        time: '08:30',
        location: 'Seattle, WA',
        capacity: 300,
        price: 149,
        registeredCount: 287,
        image: images.conference,
        tags: ['devops', 'cloud', 'kubernetes', 'docker'],
        organizer: organizerUsers[0]._id
      },

      // Sarah Johnson's events (4 events - community focused)
      {
        title: 'Community Art Exhibition',
        description: 'Showcase of local artists featuring paintings, sculptures, photography, and digital art. Free entry, refreshments provided.',
        category: 'other',
        date: new Date(now.getTime() + 15 * day),
        time: '14:00',
        location: 'Downtown Art Gallery, Portland',
        capacity: 150,
        price: 0,
        image: images.art,
        tags: ['art', 'community', 'exhibition', 'culture'],
        organizer: organizerUsers[1]._id
      },
      {
        title: 'Women in Tech Meetup',
        description: 'Monthly gathering for women in technology to share experiences, mentor each other, and build lasting professional connections.',
        category: 'networking',
        date: new Date(now.getTime() + 7 * day),
        time: '18:30',
        location: 'WeWork Downtown, Boston',
        capacity: 80,
        price: 10,
        image: images.networking,
        tags: ['women-in-tech', 'diversity', 'networking', 'career'],
        organizer: organizerUsers[1]._id
      },
      {
        title: 'Food Truck Festival (Past Event)',
        description: 'This delicious event already happened! Over 40 food trucks serving cuisine from around the world.',
        category: 'other',
        date: new Date(now.getTime() - 30 * day),
        time: '11:00',
        location: 'Waterfront Park, Miami',
        capacity: 5000,
        price: 0,
        registeredCount: 4523,
        image: images.food,
        tags: ['food', 'festival', 'community', 'family-friendly'],
        organizer: organizerUsers[1]._id
      },
      {
        title: 'Cooking Class: Italian Cuisine',
        description: 'Learn to make authentic Italian pasta, pizza, and desserts from a professional chef. All ingredients and wine included!',
        category: 'workshop',
        date: new Date(now.getTime() + 12 * day),
        time: '17:00',
        location: 'Culinary Institute, Chicago',
        capacity: 25,
        price: 85,
        image: images.food,
        tags: ['cooking', 'italian', 'food', 'hands-on'],
        organizer: organizerUsers[1]._id
      },

      // Michael Chen's events (2 events)
      {
        title: 'Blockchain Developer Bootcamp',
        description: 'Learn to build decentralized applications with Ethereum and Solidity. Hands-on coding exercises and real-world projects included.',
        category: 'workshop',
        date: new Date(now.getTime() + 45 * day),
        time: '09:30',
        location: 'Tech Hub Austin, TX',
        capacity: 50,
        price: 199,
        image: images.tech,
        tags: ['blockchain', 'ethereum', 'web3', 'programming'],
        organizer: organizerUsers[2]._id
      },
      {
        title: 'Mobile App Development Workshop',
        description: 'Build your first mobile app with React Native. Learn cross-platform development, state management, and deployment strategies.',
        category: 'workshop',
        date: new Date(now.getTime() + 25 * day),
        time: '10:00',
        location: 'Innovation Center, Austin',
        capacity: 60,
        price: 129,
        image: images.workshop,
        tags: ['mobile', 'react-native', 'app-development'],
        organizer: organizerUsers[2]._id
      },

      // Emily Rodriguez's events (2 events)
      {
        title: 'Digital Marketing Masterclass',
        description: 'Master the latest digital marketing strategies including SEO, social media, content marketing, and paid advertising.',
        category: 'seminar',
        date: new Date(now.getTime() + 20 * day),
        time: '14:00',
        location: 'Marketing Hub, Los Angeles',
        capacity: 80,
        price: 179,
        image: images.conference,
        tags: ['marketing', 'digital', 'SEO', 'social-media'],
        organizer: organizerUsers[3]._id
      },
      {
        title: 'Startup Pitch Night',
        description: 'Watch innovative startups pitch their ideas to investors and industry experts. Network with founders, VCs, and tech enthusiasts.',
        category: 'networking',
        date: new Date(now.getTime() + 35 * day),
        time: '18:00',
        location: 'Silicon Valley Innovation Center',
        capacity: 200,
        price: 25,
        image: images.networking,
        tags: ['startup', 'entrepreneurship', 'networking', 'investment'],
        organizer: organizerUsers[3]._id
      },

      // David Wilson's events (3 events - sports focused)
      {
        title: 'Charity Marathon 2025',
        description: 'Run for a cause! 5K, 10K, and half-marathon options. All proceeds go to local children\'s hospitals.',
        category: 'sports',
        date: new Date(now.getTime() + 60 * day),
        time: '07:00',
        location: 'Central Park, New York',
        capacity: 1000,
        price: 50,
        image: images.sports,
        tags: ['running', 'charity', 'fitness', 'community'],
        organizer: organizerUsers[4]._id
      },
      {
        title: 'Basketball Tournament',
        description: 'Amateur basketball tournament with prizes. Teams of 5, all skill levels welcome. Registration includes jersey and refreshments.',
        category: 'sports',
        date: new Date(now.getTime() + 40 * day),
        time: '09:00',
        location: 'Sports Complex, Denver',
        capacity: 120,
        price: 35,
        image: images.sports,
        tags: ['basketball', 'tournament', 'sports', 'competition'],
        organizer: organizerUsers[4]._id
      },
      {
        title: 'Fitness Bootcamp Weekend',
        description: 'Intensive 2-day fitness bootcamp with professional trainers. Includes meal plan, accommodation, and fitness assessment.',
        category: 'seminar',
        date: new Date(now.getTime() + 50 * day),
        time: '08:00',
        location: 'Mountain Resort, Colorado',
        capacity: 40,
        price: 399,
        image: images.workshop,
        tags: ['fitness', 'bootcamp', 'health', 'wellness'],
        organizer: organizerUsers[4]._id
      },

      // Lisa Thompson's events (2 events - arts focused)
      {
        title: 'Live Jazz & Blues Night',
        description: 'Experience an evening of soulful music with local jazz and blues performers. Full bar and light appetizers available.',
        category: 'concert',
        date: new Date(now.getTime() + 18 * day),
        time: '20:00',
        location: 'Blue Note Jazz Club, NYC',
        capacity: 120,
        price: 35,
        image: images.music,
        tags: ['music', 'jazz', 'blues', 'live-performance'],
        organizer: organizerUsers[5]._id
      },
      {
        title: 'Photography Workshop: Street Art',
        description: 'Learn street photography techniques while exploring urban art. Professional photographer guidance and equipment provided.',
        category: 'workshop',
        date: new Date(now.getTime() + 28 * day),
        time: '11:00',
        location: 'Arts District, Los Angeles',
        capacity: 30,
        price: 95,
        image: images.art,
        tags: ['photography', 'street-art', 'urban', 'workshop'],
        organizer: organizerUsers[5]._id
      },

      // Robert Kim's events (1 event)
      {
        title: 'Entrepreneurship Summit',
        description: 'Connect with successful entrepreneurs, learn about funding opportunities, and pitch your startup ideas to investors.',
        category: 'conference',
        date: new Date(now.getTime() + 55 * day),
        time: '09:00',
        location: 'Business Center, San Francisco',
        capacity: 300,
        price: 249,
        image: images.conference,
        tags: ['entrepreneurship', 'startup', 'business', 'investment'],
        organizer: organizerUsers[6]._id
      },

      // Jennifer Lopez's events (1 event)
      {
        title: 'Yoga & Meditation Retreat',
        description: 'Weekend wellness retreat featuring yoga sessions, guided meditation, healthy meals, and nature walks in a serene mountain setting.',
        category: 'seminar',
        date: new Date(now.getTime() + 42 * day),
        time: '08:00',
        location: 'Mountain View Resort, Colorado',
        capacity: 40,
        price: 299,
        image: images.workshop,
        tags: ['wellness', 'yoga', 'meditation', 'retreat'],
        organizer: organizerUsers[7]._id
      }
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log(`📅 Inserted ${createdEvents.length} events (${eventsData.filter(e => e.date > now).length} upcoming, ${eventsData.filter(e => e.date < now).length} past)`);

    // Update organizers' eventsCreated
    for (let i = 0; i < organizerUsers.length; i++) {
      const organizerEvents = createdEvents.filter(e => e.organizer.toString() === organizerUsers[i]._id.toString());
      if (organizerEvents.length > 0) {
        await User.findByIdAndUpdate(organizerUsers[i]._id, { 
          $push: { eventsCreated: { $each: organizerEvents.map(e => e._id) } } 
        });
      }
    }
    console.log('🔗 Linked events to organizers');

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
