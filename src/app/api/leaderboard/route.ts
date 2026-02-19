import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboard = await getLeaderboard();
    console.log("[leaderboard] result:", JSON.stringify(leaderboard));
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("[leaderboard] error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
