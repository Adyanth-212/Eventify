# MongoDB Setup for Eventify

You have two options for running MongoDB:

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ⭐
This is the easiest and most reliable for development.

### Steps:
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account (or sign in)
3. Create a new project
4. Create a free cluster (M0 tier)
5. Set up a database user:
   - Username: `eventify_user`
   - Password: Generate a strong password
6. Get your connection string from "Connect" → "Drivers"
7. Update your `.env` file:

```
MONGODB_URI=mongodb+srv://eventify_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/eventify?retryWrites=true&w=majority&appName=Cluster0
```

### Why Atlas is Better:
- ✅ No local setup required
- ✅ Automatic backups
- ✅ Always available
- ✅ Scalable
- ✅ Free tier is generous (512MB storage)
- ✅ Works on all machines

---

## Option 2: MongoDB Local (Docker) - Alternative

If you prefer local development, use Docker instead of Homebrew:

### Steps:
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop

2. Run MongoDB in Docker:
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

3. Update your `.env`:
```
MONGODB_URI=mongodb://admin:password@localhost:27017/eventify?authSource=admin
```

4. To stop MongoDB:
```bash
docker stop mongodb
```

5. To start it again:
```bash
docker start mongodb
```

---

## Option 3: MongoDB Local (Homebrew) - Advanced

This requires updating your Command Line Tools, which may take a while.

### If you want to proceed:
```bash
# Update Xcode tools
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --install

# Then install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Check status
brew services list
```

### Connection string:
```
MONGODB_URI=mongodb://localhost:27017/eventify
```

---

## Testing Your Connection

After setting up, test with this backend command:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net  (or localhost)
```

---

## QUICK START - Recommended Path

1. **MongoDB Atlas** (takes ~5 minutes):
   - Go to atlas.mongodb.com
   - Create free account
   - Create free cluster
   - Get connection string
   - Update `.env`
   - Run `npm run dev` in backend
   - Done! 🎉

2. **Test the connection**:
   - Frontend should load at http://localhost:5174
   - Try signing up
   - Check if user appears in MongoDB

---

## Troubleshooting

### "No module named mongod"
- Use Atlas instead (recommended)
- OR use Docker option

### "Cannot connect to MongoDB"
- Check your connection string in `.env`
- Verify MongoDB is running
- For Atlas: Check IP whitelist in Atlas dashboard

### "Authentication failed"
- Double-check username/password in connection string
- For Atlas: Make sure user exists in database access
- For local: Make sure you're using correct auth

---

**NEXT STEPS:**
1. Choose your MongoDB setup (Atlas recommended)
2. Update `.env` with connection string
3. Test connection by running `npm run dev` in backend folder
4. You'll be ready to create events!
