import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Recorded user visit:", body);

    // Здесь в дальнейшем можно добавлять запись визита в базу через Neon (db.ts)

    return NextResponse.json({ success: true, message: "Visit logged" });
  } catch (error) {
    console.error("Error processing visit:", error);
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 },
    );
  }
}
