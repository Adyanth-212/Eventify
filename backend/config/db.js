import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) { console.warn('No MONGODB_URI; skipping DB connect'); return; }
    const isProd = process.env.NODE_ENV === 'production'

if (isProd){ process.exit(1)} else console.warn('DB connect failed; continuing without DB')
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
