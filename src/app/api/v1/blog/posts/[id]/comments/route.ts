import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import nodemailer from "nodemailer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const postId = Number(id);

    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    const existingPost = await sql`
      SELECT id
      FROM posts
      WHERE id = ${postId}
      LIMIT 1
    `;

    if (existingPost.length === 0) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";

    let name = "";
    let email = "";
    let comment = "";
    let parentId: string | null = null;
    let logoUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      comment =
        (formData.get("comment") as string) ||
        (formData.get("content") as string) ||
        "";

      parentId = (formData.get("parent_id") as string) || null;

      const logoFile = formData.get("logo") as File | null;

      if (logoFile && logoFile.size > 0) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        const maxFileSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(logoFile.type)) {
          return NextResponse.json(
            {
              message: "Only JPG, PNG and WEBP images are allowed",
            },
            { status: 400 },
          );
        }

        if (logoFile.size > maxFileSize) {
          return NextResponse.json(
            {
              message: "Image must be smaller than 5MB",
            },
            { status: 400 },
          );
        }

        const blob = await put(
          `comments/${Date.now()}-${logoFile.name}`,
          logoFile,
          {
            access: "public",
          },
        );

        logoUrl = blob.url;
      }
    } else {
      const body = await request.json();

      name = body.name || "";
      email = body.email || "";
      comment = body.comment || body.content || "";
      parentId = body.parent_id || null;
    }

    name = name.trim();
    email = email.trim();
    comment = comment.trim();

    if (!name || !email || !comment) {
      return NextResponse.json(
        {
          message: "Name, email and comment are required",
        },
        { status: 400 },
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { message: "Name is too long" },
        { status: 400 },
      );
    }

    if (email.length > 255) {
      return NextResponse.json(
        { message: "Email is too long" },
        { status: 400 },
      );
    }

    if (comment.length > 5000) {
      return NextResponse.json(
        { message: "Comment is too long" },
        { status: 400 },
      );
    }

    const numericParentId = parentId ? Number(parentId) : null;

    if (
      numericParentId !== null &&
      (!Number.isInteger(numericParentId) || numericParentId <= 0)
    ) {
      return NextResponse.json(
        {
          message: "Invalid parent comment ID",
        },
        { status: 400 },
      );
    }

    if (numericParentId !== null) {
      const parentComment = await sql`
        SELECT id
        FROM comments
        WHERE id = ${numericParentId}
          AND post_id = ${postId}
        LIMIT 1
      `;

      if (parentComment.length === 0) {
        return NextResponse.json(
          {
            message: "Parent comment not found",
          },
          { status: 400 },
        );
      }
    }

    await sql`
      INSERT INTO comments (
        post_id,
        name,
        email,
        comment,
        logo,
        parent_id
      )
      VALUES (
        ${postId},
        ${name},
        ${email},
        ${comment},
        ${logoUrl},
        ${numericParentId}
      )
    `;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
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
          subject: `New comment on post #${postId} from ${name}`,
          text:
            `Name: ${name}\n` + `Email: ${email}\n\n` + `Comment:\n${comment}`,
        });
      } catch (emailError) {
        console.error("Gmail error (comment saved anyway):", emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in comments API:", error);

    return NextResponse.json(
      {
        message: "Failed to process request",
      },
      { status: 500 },
    );
  }
}
