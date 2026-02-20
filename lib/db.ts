import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = process.env.MONGODB_URI;
    if (!conn) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(conn);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}