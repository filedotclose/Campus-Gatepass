import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import  User from "../models/User";

dotenv.config({ path: ".env.local" });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Test Student",
    rollNo: "123",
    email: "student@test.com",
    passwordHash: hashedPassword,
    role: "student",
  });

  console.log("User created");
  process.exit();
}

seed();
