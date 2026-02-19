import mongoose from "mongoose";

const passSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "IN_LIBRARY", "RETURNED"],
    default: "PENDING",
  },
  // Timestamps for the state machine
  hostelOutTime: { type: Date },
  libraryInTime: { type: Date },
  libraryOutTime: { type: Date },
  hostelInTime: { type: Date },
  
  // Metadata
  reason: { type: String, default: "Library Visit" },
  createdAt: { type: Date, default: Date.now },
});

// Virtuals for travel time
passSchema.virtual("transitToLibrary").get(function() {
  if (this.hostelOutTime && this.libraryInTime) {
    return Math.floor((this.libraryInTime.getTime() - this.hostelOutTime.getTime()) / 60000);
  }
  return null;
});

passSchema.virtual("transitToHostel").get(function() {
  if (this.libraryOutTime && this.hostelInTime) {
    return Math.floor((this.hostelInTime.getTime() - this.libraryOutTime.getTime()) / 60000);
  }
  return null;
});

passSchema.set("toJSON", { virtuals: true });
passSchema.set("toObject", { virtuals: true });

export default mongoose.models.pass || mongoose.model("pass", passSchema);
