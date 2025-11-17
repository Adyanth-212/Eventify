import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  bio: String,
  phone: String,
  eventsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  eventsRegistered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  date: Date,
  time: String,
  location: String,
  capacity: Number,
  price: { type: Number, default: 0 },
  image: String,
  tags: [String],
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  registeredCount: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

const images = {
  tech: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%234a90e2"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E💻 Tech%3C/text%3E%3C/svg%3E',
  workshop: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23e67e22"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🛠️ Workshop%3C/text%3E%3C/svg%3E',
  networking: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%239b59b6"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🤝 Network%3C/text%3E%3C/svg%3E',
  music: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23e74c3c"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🎵 Music%3C/text%3E%3C/svg%3E',
  sports: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%2327ae60"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E⚽ Sports%3C/text%3E%3C/svg%3E',
  art: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23f39c12"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🎨 Art%3C/text%3E%3C/svg%3E',
  food: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23d35400"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E🍕 Food%3C/text%3E%3C/svg%3E',
  conference: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%2334495e"/%3E%3Ctext x="400" y="200" font-size="48" fill="white" text-anchor="middle"%3E📊 Conf%3C/text%3E%3C/svg%3E'
};

async function insertData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventify');
    console.log('✅ Connected to MongoDB');

    // Clear existing demo data
    console.log('🗑️  Clearing existing demo data...');
    await User.deleteMany({ email: { $regex: '@eventify\\.demo' } });
    await Event.deleteMany({});

    console.log('👥 Creating 25 users...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const usersData = [
      // 8 Organizers
      { name: 'Alex Rivera', email: 'alex@eventify.demo', password: hashedPassword, role: 'organizer', bio: 'Tech events specialist', phone: '+1-555-0101' },
      { name: 'Sarah Chen', email: 'sarah@eventify.demo', password: hashedPassword, role: 'organizer', bio: 'Community builder', phone: '+1-555-0102' },
      { name: 'Marcus Johnson', email: 'marcus@eventify.demo', password: hashedPassword, role: 'organizer', bio: 'Music & arts curator', phone: '+1-555-0103' },
      { name: 'Emma Rodriguez', email: 'emma@eventify.demo', password: hashedPassword, role: 'organizer', bio: 'Sports event coordinator', phone: '+1-555-0104' },
      { name: 'David Kim', email: 'david@eventify.demo', password: hashedPassword, role: 'organizer', bio: 'Workshop facilitator', phone: '+1-555-0105' },
      { name: 'Lisa Thompson', email: 'lisa@eventify.demo', password: hashedPassword, role: 'organizer', bio: 'Conference organizer', phone: '+1-555-0106' },
      { name: 'James Park', email: 'james@eventify.demo', password: hashedPassword, role: 'organizer', bio: 'Networking event host', phone: '+1-555-0107' },
      { name: 'Nina Patel', email: 'nina@eventify.demo', password: hashedPassword, role: 'organizer', bio: 'Cultural events producer', phone: '+1-555-0108' },
      
      // 17 Attendees
      { name: 'Michael Brown', email: 'michael@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Jessica Lee', email: 'jessica@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Ryan Garcia', email: 'ryan@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Amanda Wilson', email: 'amanda@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Chris Martinez', email: 'chris@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Laura Davis', email: 'laura@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Kevin Zhang', email: 'kevin@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Rachel Adams', email: 'rachel@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Tyler Scott', email: 'tyler@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Sophie Turner', email: 'sophie@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Brandon Hall', email: 'brandon@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Victoria Moore', email: 'victoria@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Daniel White', email: 'daniel@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Olivia Harris', email: 'olivia@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Jason Clark', email: 'jason@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Maya Lewis', email: 'maya@eventify.demo', password: hashedPassword, role: 'attendee' },
      { name: 'Nathan Young', email: 'nathan@eventify.demo', password: hashedPassword, role: 'attendee' }
    ];

    const users = await User.insertMany(usersData);
    const organizers = users.filter(u => u.role === 'organizer');
    
    console.log('📅 Creating 18 events...');
    const now = new Date();
    const day = 86400000;
    
    const eventsData = [
      // Alex - 4 events (tech focus)
      { title: 'AI & Machine Learning Summit', description: 'Explore the future of AI with industry leaders. Keynotes, workshops, and networking.', category: 'conference', date: new Date(now.getTime() + 30*day), time: '09:00', location: 'San Francisco, CA', capacity: 300, price: 199, image: images.tech, tags: ['AI', 'ML', 'tech'], organizer: organizers[0]._id },
      { title: 'React Advanced Workshop', description: 'Master React hooks, performance optimization, and advanced patterns.', category: 'workshop', date: new Date(now.getTime() + 15*day), time: '10:00', location: 'Online', capacity: 80, price: 0, image: images.workshop, tags: ['react', 'javascript'], organizer: organizers[0]._id },
      { title: 'Web3 Developer Bootcamp', description: 'Build decentralized apps with Ethereum and Solidity.', category: 'workshop', date: new Date(now.getTime() + 45*day), time: '09:30', location: 'Austin, TX', capacity: 50, price: 249, image: images.tech, tags: ['blockchain', 'web3'], organizer: organizers[0]._id },
      { title: 'Tech Startup Pitch Night', description: 'Watch startups pitch to investors. Network with founders and VCs.', category: 'networking', date: new Date(now.getTime() + 20*day), time: '18:00', location: 'Silicon Valley', capacity: 150, price: 25, image: images.networking, tags: ['startup', 'investing'], organizer: organizers[0]._id },
      
      // Sarah - 3 events (community)
      { title: 'Community Art Exhibition', description: 'Local artists showcase paintings, sculptures, and photography.', category: 'other', date: new Date(now.getTime() + 10*day), time: '14:00', location: 'Portland Art Gallery', capacity: 200, price: 0, image: images.art, tags: ['art', 'community'], organizer: organizers[1]._id },
      { title: 'Women in Tech Meetup', description: 'Monthly gathering for women in technology. Mentorship and networking.', category: 'networking', date: new Date(now.getTime() + 5*day), time: '18:30', location: 'Boston, MA', capacity: 60, price: 10, image: images.networking, tags: ['diversity', 'tech'], organizer: organizers[1]._id },
      { title: 'Charity Fun Run 5K', description: 'Run for a cause! All proceeds support local schools.', category: 'sports', date: new Date(now.getTime() + 60*day), time: '08:00', location: 'Central Park, NYC', capacity: 500, price: 35, image: images.sports, tags: ['charity', 'fitness'], organizer: organizers[1]._id },
      
      // Marcus - 3 events (music/arts)
      { title: 'Jazz & Blues Night', description: 'Live performances by local jazz musicians. Full bar available.', category: 'concert', date: new Date(now.getTime() + 25*day), time: '20:00', location: 'Blue Note NYC', capacity: 100, price: 40, image: images.music, tags: ['jazz', 'music'], organizer: organizers[2]._id },
      { title: 'Indie Rock Festival', description: 'Two-day festival featuring 12 indie rock bands.', category: 'concert', date: new Date(now.getTime() + 50*day), time: '15:00', location: 'LA Music Center', capacity: 2000, price: 85, image: images.music, tags: ['rock', 'festival'], organizer: organizers[2]._id },
      { title: 'Photography Workshop', description: 'Learn portrait and landscape photography from a pro.', category: 'workshop', date: new Date(now.getTime() + 12*day), time: '10:00', location: 'Seattle, WA', capacity: 20, price: 120, image: images.art, tags: ['photography', 'art'], organizer: organizers[2]._id },
      
      // Emma - 2 events (sports)
      { title: 'Basketball Tournament', description: '3v3 street basketball tournament. Prizes for top teams.', category: 'sports', date: new Date(now.getTime() + 35*day), time: '09:00', location: 'Venice Beach, CA', capacity: 64, price: 50, image: images.sports, tags: ['basketball', 'tournament'], organizer: organizers[3]._id },
      { title: 'Yoga in the Park', description: 'Free outdoor yoga session for all skill levels.', category: 'seminar', date: new Date(now.getTime() + 7*day), time: '07:00', location: 'Golden Gate Park', capacity: 100, price: 0, image: images.workshop, tags: ['yoga', 'wellness'], organizer: organizers[3]._id },
      
      // David - 2 events (workshops)
      { title: 'Digital Marketing Masterclass', description: 'SEO, social media, and content marketing strategies.', category: 'workshop', date: new Date(now.getTime() + 18*day), time: '13:00', location: 'Online', capacity: 150, price: 79, image: images.workshop, tags: ['marketing', 'business'], organizer: organizers[4]._id },
      { title: 'Data Science Bootcamp', description: 'Python, pandas, and machine learning for beginners.', category: 'workshop', date: new Date(now.getTime() + 40*day), time: '09:00', location: 'Chicago, IL', capacity: 40, price: 199, image: images.tech, tags: ['data-science', 'python'], organizer: organizers[4]._id },
      
      // Lisa - 2 events (conferences)
      { title: 'Healthcare Innovation Summit', description: 'Future of healthcare technology and telemedicine.', category: 'conference', date: new Date(now.getTime() + 55*day), time: '08:30', location: 'Boston Convention Center', capacity: 400, price: 299, image: images.conference, tags: ['healthcare', 'innovation'], organizer: organizers[5]._id },
      { title: 'Sustainability Forum', description: 'Climate change, renewable energy, and sustainable business.', category: 'seminar', date: new Date(now.getTime() + 28*day), time: '10:00', location: 'Denver, CO', capacity: 200, price: 50, image: images.conference, tags: ['environment', 'sustainability'], organizer: organizers[5]._id },
      
      // James - 1 event (networking)
      { title: 'Speed Networking Event', description: 'Meet 20+ professionals in 2 hours. Refreshments included.', category: 'networking', date: new Date(now.getTime() + 8*day), time: '17:30', location: 'Manhattan, NY', capacity: 80, price: 20, image: images.networking, tags: ['networking', 'career'], organizer: organizers[6]._id },
      
      // Nina - 1 event (cultural)
      { title: 'International Food Festival', description: 'Taste cuisine from 30+ countries. Live cultural performances.', category: 'other', date: new Date(now.getTime() + 42*day), time: '11:00', location: 'Miami Beach', capacity: 3000, price: 15, image: images.food, tags: ['food', 'culture', 'festival'], organizer: organizers[7]._id }
    ];

    const events = await Event.insertMany(eventsData);
    
    // Link events to organizers
    for (let org of organizers) {
      const orgEvents = events.filter(e => e.organizer.toString() === org._id.toString());
      await User.findByIdAndUpdate(org._id, { eventsCreated: orgEvents.map(e => e._id) });
    }
    
    console.log('✅ Created 25 users (8 organizers, 17 attendees)');
    console.log('✅ Created 18 events with posters');
    console.log('\n📊 Event distribution:');
    console.log('   Alex: 4 events');
    console.log('   Sarah: 3 events');
    console.log('   Marcus: 3 events');
    console.log('   Emma: 2 events');
    console.log('   David: 2 events');
    console.log('   Lisa: 2 events');
    console.log('   James: 1 event');
    console.log('   Nina: 1 event');
    console.log('\n🔐 Login credentials (all use password: password123):');
    console.log('   alex@eventify.demo (organizer - 4 events)');
    console.log('   sarah@eventify.demo (organizer - 3 events)');
    console.log('   michael@eventify.demo (attendee)');
    
    await mongoose.disconnect();
    console.log('\n✨ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

insertData();
