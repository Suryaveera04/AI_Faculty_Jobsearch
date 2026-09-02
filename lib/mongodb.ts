/**
 * MongoDB Connection Utility for ACADEXMATCH.AI
 * 
 * To connect to your local MongoDB Compass instance:
 * 1. Ensure MongoDB daemon is running locally on mongodb://localhost:27017
 * 2. Set MONGODB_URI in your .env.local file:
 *    MONGODB_URI=mongodb://localhost:27017/acadexmatch
 */

// Global cached connection for Next.js hot-reloading
declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acadexmatch';

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      // Dynamic import of mongoose if installed
      const mongoose = await import('mongoose');
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      }).then((m) => {
        console.log(`[ACADEXMATCH.AI] Connected to MongoDB at ${MONGODB_URI}`);
        return m;
      });
    } catch (e) {
      console.warn('[ACADEXMATCH.AI] MongoDB Mongoose driver not active; using client-side Reactive Storage.');
      return null;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}
