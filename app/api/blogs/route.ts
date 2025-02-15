import Blog from "@/app/models/Blog";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, overview, description, imageUrl } = await req.json();
    if (!title || !overview || !description || !imageUrl) {
      return NextResponse.json(
        { message: "All fields are required!" },
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
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to create blog" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
