/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";

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
    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }
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

      if (!response.ok) throw new Error("Failed to delete blog");

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {blogs.length ? (
        blogs.map((blog) => (
          <Card key={blog._id} className="flex flex-col items-center">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical
                    size={20}
                    className="absolute top-2 right-2"
                  />
                  <DropdownMenuContent className="flex flex-col space-y-2">
                    <Button>Edit</Button>
                    <Button onClick={() => deleteBlog(blog._id)}>Delete</Button>
                  </DropdownMenuContent>
                </DropdownMenuTrigger>
              </DropdownMenu>
              <img src={blog.imageUrl} alt="photo" className="h-full w-full" />
            </div>
            <CardHeader>{blog.title}</CardHeader>
            <CardContent>
              <CardDescription>{blog.overview}</CardDescription>
              <CardDescription>{blog.description}</CardDescription>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No blogs available</p>
      )}
    </div>
  );
}
