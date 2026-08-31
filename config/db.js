import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the DB_URL environment variable inside .env");
}

// Global cache prevents multiple connections across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fails instantly instead of hanging for 10s if DB is unreachable
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected: " + mongooseInstance.connection.host);
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise cache on failure to allow retries
    console.error("Error connecting to MONGODB: " + e.message);
    throw e;
  }

  return cached.conn;
};
