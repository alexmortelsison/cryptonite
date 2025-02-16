/* eslint-disable @next/next/no-img-element */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    const res = await fetch("/api/blogs");
    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }
    setBlogs(await res.json());
  };

  useEffect(() => {
    fetchBlogs();
  }, [refresh]);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      {blogs.length ? (
        blogs.map((blog) => (
          <Card key={blog._id} className="border border-gray-700 bg-gray-900">
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{blog.overview}</p>
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-48 object-cover mt-2 rounded-lg"
                />
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-400">No blogs available.</p>
      )}
    </div>
  );
}
