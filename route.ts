import { NextResponse } from "next/server";
import { getSessionUsername } from "@/lib/auth";
import { getVisitors, getVisitorStats } from "@/lib/visitors";

export async function GET() {
  if (!getSessionUsername()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [visitors, stats] = await Promise.all([
      getVisitors(),
      getVisitorStats(),
    ]);
    return NextResponse.json({ visitors, stats });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
