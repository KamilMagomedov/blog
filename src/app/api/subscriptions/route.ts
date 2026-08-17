import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return Response.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return Response.json(
        {
          message: "Please enter a valid email address",
        },
        {
          status: 400,
        },
      );
    }

    const subscription = await sql`
      INSERT INTO subscriptions (email)
      VALUES (${email})
      RETURNING id, email, created_at
    `;

    return Response.json(
      {
        success: true,
        subscription: subscription[0],
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    const databaseError = error as {
      code?: string;
    };

    if (databaseError.code === "23505") {
      return Response.json(
        {
          message: "This email is already subscribed",
        },
        {
          status: 409,
        },
      );
    }

    console.error("Subscription error:", error);

    return Response.json(
      {
        message: "Failed to subscribe",
      },
      {
        status: 500,
      },
    );
  }
}
