import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { errors: { email: ["Please enter a valid email address"] } },
        { status: 400 },
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      INSERT INTO subscriptions (email) 
      VALUES (${email}) 
      ON CONFLICT (email) DO NOTHING
    `;

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { errors: { email: ["Failed to process subscription"] } },
      { status: 500 },
    );
  }
}
