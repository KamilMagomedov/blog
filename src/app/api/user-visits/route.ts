import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await request.json();

    return NextResponse.json({ success: true, message: "Visit logged" });
  } catch (error) {
    console.error("Error processing visit:", error);
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 },
    );
  }
}
