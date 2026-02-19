const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MONGODB_URI = "mongodb+srv://admin:admin@cluster0.mongodb.net/gatepass?retryWrites=true&w=majority"; // Fallback placeholder, usually read from process.env

async function seed() {
    const uri = process.env.MONGODB_URI || MONGODB_URI;
    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

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

    console.log("Seeding complete!");
    process.exit(0);
}

seed();
