import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import LibraryRegistry from "@/models/LibraryRegistry";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "librarian") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    await connectDB();

    const registry = await LibraryRegistry.find({ date })
      .sort({ inTime: -1 });

    return NextResponse.json(registry);
  } catch (error) {
    console.error("Fetch registry error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
