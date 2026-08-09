import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await sql`
      UPDATE posts 
      SET likes = GREATEST(0, COALESCE(likes, 0) - 1) 
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dislike error:", error);
    return NextResponse.json(
      { error: "Failed to dislike post" },
      { status: 500 },
    );
  }
}
