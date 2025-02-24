/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Blog {
  _id: string;
  title: string;
  overview: string;
  description: string;
  imageUrl: string;
}

export default function BlogFeed({ refresh }: { refresh: boolean }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    const response = await fetch("/api/blogs");
    setBlogs(await response.json());
  };

  useEffect(() => {
    fetchBlogs();
  }, [refresh]);

  const deleteBlog = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const response = await fetch(`/api/blogs?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error deleting blog.");
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      return toast.error("Failed to delete blog.");
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Card key={blog._id} className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical className="absolute right-1 top-1 hover:cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col space-y-2">
                <Button>Edit</Button>
                <Button onClick={() => deleteBlog(blog._id)}>Delete</Button>
              </DropdownMenuContent>
            </DropdownMenu>
            <img
              src={blog.imageUrl}
              alt="photo"
              className="rounded-t-md h-60 w-full"
            />
            <CardContent className="flex justify-center mt-4 flex-col items-center">
              <CardTitle>{blog.title}</CardTitle>
              <CardDescription className=" text-center mt-4 h-[120px] line-clamp-6">
                {blog.overview}
              </CardDescription>
              <Button className="mt-8" asChild>
                <Link href={`/dashboard/${blog._id}`}>Read more</Link>
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No blogs available.</p>
      )}
    </div>
  );
}
