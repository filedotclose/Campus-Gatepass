import mongoose from "mongoose";

const libraryRegistrySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  passId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pass",
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD for easy day-wise grouping
    required: true,
  },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  inTime: { type: Date, default: Date.now },
  outTime: { type: Date },
});

// Index for performance when querying logs by date or student
libraryRegistrySchema.index({ date: 1, studentId: 1 });

export default mongoose.models.libraryRegistry || mongoose.model("libraryRegistry", libraryRegistrySchema);
