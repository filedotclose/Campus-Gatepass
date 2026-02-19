const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MONGODB_URI = "mongodb://127.0.0.1:27017/gatepass";

async function seed() {
    try {
        console.log("Starting seeding process...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB...");

        const UserSchema = new mongoose.Schema({
            name: String,
            rollNo: { type: String, unique: true },
            email: { type: String, unique: true },
            passwordHash: String,
            role: String
        });

        // Explicit model check to match 'user' in the app
        const User = mongoose.models.user || mongoose.model("user", UserSchema);

        const passwordHash = await bcrypt.hash("password123", 10);

        const users = [
            { name: "Test Student", rollNo: "STU001", email: "student@campus.edu", passwordHash, role: "student" },
            { name: "Test Warden", rollNo: "WRD001", email: "warden@campus.edu", passwordHash, role: "warden" },
            { name: "Test Librarian", rollNo: "LIB001", email: "librarian@campus.edu", passwordHash, role: "librarian" }
        ];

        for (const u of users) {
            await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
            console.log(`Successfully Seeded ${u.role}: ${u.email}`);
        }

        console.log("Database Seeded Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error Details:", err);
        process.exit(1);
    }
}

seed();
