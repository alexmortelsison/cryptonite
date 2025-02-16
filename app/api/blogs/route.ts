import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/app/models/Blog";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, overview, description, imageUrl } = await req.json();

    if (!title || !overview || !description || !imageUrl) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const newBlog = await Blog.create({
      title,
      overview,
      description,
      imageUrl,
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
