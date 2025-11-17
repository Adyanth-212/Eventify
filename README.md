# Eventify

A professional full-stack event management platform built with the MERN stack (MongoDB, Express, React, Node.js). Eventify enables users to discover events, organizers to manage their events, and administrators to oversee the entire platform.

## Features

### For Attendees
- Browse and search events by category, date, and location
- Register for events with automatic capacity management
- View registration history and manage active registrations
- Update profile settings and account information

### For Event Organizers
- Create and manage events with detailed information
- Track event registrations and attendee lists
- Edit or delete owned events
- View dashboard statistics (total events, upcoming events, attendee count)

### For Administrators
- Comprehensive admin dashboard with user and event management
- View and manage all users across the platform
- Delete any event or user account
- Access platform-wide statistics and analytics
- Review and manage user feedback

## Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool with HMR
- **React Router** - SPA routing with protected routes
- **Axios** - HTTP client with JWT interceptors
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

## Project Structure

```
eventify/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── scripts/         # Database seeding
│   └── server.js        # Entry point
├── src/
│   ├── components/      # React components
│   ├── context/         # Auth context provider
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── styles/          # CSS files
│   └── utils/           # Helper functions
└── public/              # Static assets
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Adyanth-212/eventify.git
cd eventify
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/eventify
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Seed the Database (Optional)

Populate the database with sample data:
```bash
cd backend
node scripts/seed.js
cd ..
```

### 6. Run the Application

Start both frontend and backend servers:
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5002

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/my-events` - Get organizer's events
- `POST /api/events` - Create event (organizer/admin)
- `PUT /api/events/:id` - Update event (owner only)
- `DELETE /api/events/:id` - Delete event (owner/admin)
- `GET /api/events/search` - Search events

### Registrations
- `POST /api/registrations/:eventId` - Register for event
- `DELETE /api/registrations/:eventId` - Unregister from event
- `GET /api/registrations/my` - Get user's registrations
- `GET /api/registrations/event/:eventId` - Get event attendees

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (admin only)

## User Roles & Permissions

### Attendee (Default)
- View and search events
- Register for events
- Manage own registrations
- Update profile settings

### Organizer
- All attendee permissions
- Create and manage events
- View event attendees
- Access organizer dashboard

### Admin
- Full platform access
- Manage all users and events
- Delete any content
- View all feedback
- Access admin dashboard

## Authentication Flow

1. User signs up or logs in
2. Server generates JWT token with user ID and role
3. Token stored in localStorage
4. Axios interceptor attaches token to all requests
5. Backend middleware validates token and attaches user to request
6. Role-based authorization checks for protected routes

## Development Scripts

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run web

# Run backend only
npm run api

# Build for production
npm run build

# Preview production build
npm run preview
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with middleware
- Role-based access control (RBAC)
- Request validation
- Error handling middleware
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Adyanth Mallur**
- GitHub: [@Adyanth-212](https://github.com/Adyanth-212)

## Acknowledgments

- Built with React, Node.js, Express, and MongoDB
- Styled with custom CSS and modern design principles
- JWT authentication implementation
- MongoDB for flexible data storage
