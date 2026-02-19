import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User  from "../models/User";

dotenv.config({ path: ".env.local" });

const seedUsers = [
  {
    name: "John Student",
    rollNo: "S101",
    email: "student@test.com",
    password: "password123",
    role: "student",
  },
  {
    name: "Alice Warden",
    rollNo: "W202",
    email: "warden@test.com",
    password: "password123",
    role: "warden",
  },
  {
    name: "Bob Librarian",
    rollNo: "L303",
    email: "librarian@test.com",
    password: "password123",
    role: "librarian",
  },
];

async function seed() {
  try {
    const conn = process.env.DB;
    if (!conn) throw new Error("DB env var missing");

    await mongoose.connect(conn);
    console.log("Connected to DB for seeding...");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users.");

    for (const u of seedUsers) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      await User.create({
        name: u.name,
        rollNo: u.rollNo,
        email: u.email,
        passwordHash,
        role: u.role,
      });
      console.log(`Created ${u.role}: ${u.email}`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
