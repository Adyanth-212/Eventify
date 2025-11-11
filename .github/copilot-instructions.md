# Eventify Copilot Instructions

## Project Overview
Eventify is a full-stack **MERN event management platform** (MongoDB, Express, React, Node.js) with:
- **Frontend**: React 19 + Vite with SPA routing, global auth state, and responsive UI
- **Backend**: Node.js/Express REST API with JWT auth, role-based access control (RBAC), and MongoDB Mongoose ODM
- **Key Feature**: Events discovery, user registration, role-based dashboards, feedback system

## Architecture Essentials

### Frontend Architecture (`src/`)
- **Entry point**: `main.jsx` → `App.jsx` (routes defined here)
- **State Management**: `context/AuthContext.jsx` provides `{user, loading, error, login, signup, logout}`
- **API Client**: `services/api.js` exports `{eventService, authService, registrationService, feedbackService}`
  - **Critical pattern**: Request interceptor injects JWT token from localStorage; 401 responses trigger logout & redirect to `/login`
- **Pages**: Home, Login, Signup, Events (discovery), Dashboard (tabs: my-events, registrations, settings)
- **Styling**: CSS files in `styles/` use flexbox, gradient backgrounds, CSS variables from `globals.css`

### Backend Architecture (`backend/`)
- **Server**: `server.js` instantiates Express, connects MongoDB, mounts routes, applies CORS & error handler
- **Database Connection**: `config/db.js` (Mongoose connection with error logging)
- **Models** (`models/`): User, Event, Registration, Feedback—all use Mongoose schemas with timestamps
- **Middleware** (`middleware/`):
  - `auth.js`: `protect()` extracts & validates JWT; `authorize(...roles)` checks user role
  - `errorHandler.js`: Centralized error handling for CastError (invalid ObjectId), duplicate keys (11000), ValidationError
- **Controllers** (`controllers/`): Async functions handling business logic (auth, CRUD, search)
- **Routes** (`routes/`): Mount controllers with middleware (e.g., `router.get('/me', protect, getMe)`)

## Critical Patterns & Conventions

### Authentication Flow
1. Frontend: `signup()`/`login()` posts to `/api/auth/{signup,login}` → backend returns `{token, user}`
2. Token stored in localStorage; subsequent requests include `Authorization: Bearer <token>`
3. Backend `protect()` middleware decodes JWT, attaches `req.user = {id, role}`
4. Invalid/expired tokens: frontend interceptor clears localStorage & redirects to login

### Data Models
- **User**: `{name, email, password (hashed), role, profilePicture, bio, phone, eventsCreated[], eventsRegistered[]}`
- **Event**: `{title, description, category, image, date, time, location, capacity, registeredCount, organizer (ref), attendees (refs), tags, latitude, longitude}`
- **Registration**: `{user (ref), event (ref), status (registered/attended/cancelled), ticketNumber}`
- **Feedback**: `{name, email, subject, message, type (feedback/bug/suggestion), status (new/reviewed/resolved)}`

### API Response Format
```javascript
// Success: {success: true, message?: string, data?: {...}, user?: {...}, token?: string}
// Error: {success: false, message: string}
```

### Role-Based Access Control
- **attendee** (default): Can view events, register, view own registrations
- **organizer**: Can create/edit/delete own events, view event attendees
- **admin**: Can view all feedback, update feedback status

## Development Workflow

### Running the Application
```bash
# Terminal 1: Backend
cd backend && npm run dev
# Starts on http://localhost:5000; uses nodemon for auto-reload

# Terminal 2: Frontend
npm run dev
# Starts on http://localhost:5174 (Vite dev server with HMR)
```

### Environment Variables
- **Frontend** (`VITE_API_URL`): Vite-prefixed env vars; defaults to `http://localhost:5000/api`
- **Backend** (`.env`): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`, `CORS_ORIGIN`

### Build & Deployment
```bash
# Frontend
npm run build          # Creates `dist/` folder
npm run preview        # Test production build locally

# Backend
npm start              # Runs `node server.js` (no nodemon)
```

## Code Style & Best Practices

### Frontend (React/JSX)
- Use **functional components** with hooks (useState, useContext, useEffect)
- **Custom hook pattern**: `useAuth()` wraps `useContext(AuthContext)` for convenience
- **Protected routes**: Wrap routes with `<ProtectedRoute>` component which checks `AuthContext.loading` and `user`
- **Error handling**: Catch API errors in try/catch, display via `error` state or toast UI (not yet implemented)
- **CSS organization**: One CSS file per page/component; use CSS variables for colors from `globals.css`

### Backend (Node/Express)
- **Async/await**: All controllers use async functions wrapped with `asyncHandler()` (exported from errorHandler.js)
- **Error propagation**: Use `next(error)` to pass errors to middleware error handler
- **Validation**: Use `express-validator` for request validation (setup ready, not all routes validated yet)
- **Mongoose patterns**:
  - Use `.select('+password')` to include password field when needed (normally excluded)
  - Use `.populate(field)` to resolve references
  - Use `.lean()` for read-only queries to improve performance

## Key Files & Their Responsibilities

| File | Purpose |
|------|---------|
| `src/App.jsx` | React Router setup, route definitions |
| `src/context/AuthContext.jsx` | Global auth state, login/signup/logout logic |
| `src/services/api.js` | Axios client with interceptors & service methods |
| `src/utils/useAuth.js` | Custom hook for auth context |
| `backend/server.js` | Express app, DB connection, middleware setup |
| `backend/middleware/auth.js` | JWT verification & role authorization |
| `backend/middleware/errorHandler.js` | Centralized error handling |
| `backend/controllers/*.js` | Business logic for each resource |
| `backend/models/*.js` | Mongoose schemas & methods |

## Common Tasks

### Adding a New API Endpoint
1. Create controller function in `backend/controllers/resourceController.js`
2. Add route in `backend/routes/resourceRoutes.js` (apply `protect` and/or `authorize()` as needed)
3. Mount route in `backend/server.js`: `app.use('/api/resource', resourceRoutes)`
4. In frontend, add service method to `src/services/api.js` using `apiClient`
5. Use service in component (e.g., `await eventService.getAll()`)

### Querying with Relationships
```javascript
// Example: Get event with organizer details
const event = await Event.findById(id).populate('organizer', 'name email profilePicture');
```

### Debugging Tips
- **Frontend**: Check localStorage for token; verify `AuthContext` provides values via React DevTools
- **Backend**: Errors logged to console; check JWT_SECRET matches signup/login tokens
- **API**: Test endpoints with `/api/health` endpoint (returns `{status: 'OK'}`)

## Dependencies to Know
- **Frontend**: `react-router-dom` for SPA routing; `axios` for HTTP; Vite for build tool
- **Backend**: `express` for HTTP server; `mongoose` for MongoDB; `jsonwebtoken` for JWT; `bcryptjs` for password hashing
