/* eslint-disable no-var */
import mongoose from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ MONGODB_URI is missing in .env.local! Make sure to add it."
  );
}

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

globalThis.mongoose = globalThis.mongoose || { conn: null, promise: null };

const connectDB = async (): Promise<mongoose.Connection> => {
  if (globalThis.mongoose.conn) return globalThis.mongoose.conn;

  try {
    globalThis.mongoose.promise =
      globalThis.mongoose.promise ||
      mongoose
        .connect(MONGODB_URI, { dbName: "blog-db" })
        .then((m) => m.connection);

    globalThis.mongoose.conn = await globalThis.mongoose.promise;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("Failed to connect to MongoDB");
  }

  return globalThis.mongoose.conn;
};

export default connectDB;
