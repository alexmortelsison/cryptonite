import Blog from "@/app/models/Blog";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, overview, description, imageUrl } = await req.json();
    if (!title || !overview || !description || !imageUrl) {
      return NextResponse.json(
        { error: "All fields are required!" },
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
    console.error("Create error:", error);
    return NextResponse.json(
      { error: "Error in creating a new blog" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 201 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // Extract blog ID from query params

  if (!id) {
    return NextResponse.json(
      { message: "Blog ID is required" },
      { status: 400 }
    );
  }

  try {
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error deleting blog" },
      { status: 500 }
    );
  }
}
