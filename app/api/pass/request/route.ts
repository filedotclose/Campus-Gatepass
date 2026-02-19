import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pass from "@/models/Pass";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "student") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { reason } = await req.json();

    await connectDB();

    // Check if there's already an active pass
    const activePass = await Pass.findOne({
      studentId: user._id,
      status: { $in: ["PENDING", "APPROVED", "IN_LIBRARY"] },
    });

    if (activePass) {
      return NextResponse.json(
        { message: "You already have an active pass request" },
        { status: 400 }
      );
    }

    const newPass = await Pass.create({
      studentId: user._id,
      reason: reason || "Library Visit",
      status: "PENDING",
    });

    return NextResponse.json(newPass, { status: 201 });
  } catch (error) {
    console.error("Pass request error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
