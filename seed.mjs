import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Explicitly using the URI found in .env.local
const MONGODB_URI = "mongodb+srv://24051292_db_user:24051292DbUser@cluster-learn.ajezm8v.mongodb.net/CG";

async function seed() {
    try {
        console.log("Seeding to:", MONGODB_URI.split('@')[1]); // Log only the cluster part for safety
        await mongoose.connect(MONGODB_URI);
        console.log("Connected Successfully.");

        const UserSchema = new mongoose.Schema({
            name: String,
            rollNo: { type: String, unique: true },
            email: { type: String, unique: true },
            passwordHash: String,
            role: String
        });

        const User = mongoose.models.user || mongoose.model("user", UserSchema);

        const passwordHash = await bcrypt.hash("password123", 10);

        const users = [
            { name: "Test Student", rollNo: "STU001", email: "student@campus.edu", passwordHash, role: "student" },
            { name: "Test Warden", rollNo: "WRD001", email: "warden@campus.edu", passwordHash, role: "warden" },
            { name: "Test Librarian", rollNo: "LIB001", email: "librarian@campus.edu", passwordHash, role: "librarian" }
        ];

        for (const u of users) {
            await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
            console.log(`Seeded ${u.role}: ${u.email}`);
        }

        console.log("Database Seeded Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
}

seed();
