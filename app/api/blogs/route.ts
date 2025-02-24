import Blog from "@/app/models/Blog";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, overview, description, imageUrl } = await req.json();
    if (!title || !overview || !description || !imageUrl) {
      return NextResponse.json({ error: "All fields required." });
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
    console.error("Create blog error:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
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
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Blog id is required." },
      { status: 400 }
    );
  }
  try {
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted" }, { status: 201 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed deleting blog" },
      { status: 500 }
    );
  }
}
