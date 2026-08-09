import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";

    let name = "";
    let email = "";
    let content = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      content =
        (formData.get("content") as string) ||
        (formData.get("message") as string) ||
        "";
    } else {
      const body = await request.json();
      name = body.name || "";
      email = body.email || "";
      content = body.content || body.message || "";
    }

    await sql`
      INSERT INTO comments (post_id, author_name, author_email, content)
      VALUES (${id}, ${name}, ${email}, ${content})
    `;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Новый комментарий к посту #${id} от ${name}`,
        text: `Имя: ${name}\nEmail: ${email}\n\nСообщение:\n${content}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error in comments API:", error);
    return NextResponse.json(
      { message: "Failed to process request" },
      { status: 500 },
    );
  }
}
