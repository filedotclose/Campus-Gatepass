import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pass from "@/models/Pass";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "librarian") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { passId } = await req.json();
    if (!passId) {
      return NextResponse.json({ message: "Pass ID required" }, { status: 400 });
    }

    await connectDB();

    const pass = await Pass.findById(passId);
    if (!pass) {
      return NextResponse.json({ message: "Pass not found" }, { status: 404 });
    }

    // Status could be APPROVED (if they just came from hostel)
    if (pass.status !== "APPROVED") {
      return NextResponse.json({ message: "Invalid pass status for library entry" }, { status: 400 });
    }

    if (!pass.hostelOutTime) {
      return NextResponse.json({ message: "Student must have exited the hostel before library entry" }, { status: 400 });
    }

    pass.status = "IN_LIBRARY";
    pass.libraryInTime = new Date();
    await pass.save();

    return NextResponse.json(pass);
  } catch (error) {
    console.error("Library entry error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
