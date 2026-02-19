import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "warden", "librarian"],
    required: true,
  },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.user || mongoose.model("user", userSchema);