"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
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
    if (!response.ok) {
      toast.error("Failed to fetch blogs.");
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
      if (!response.ok) throw new Error("Error deleting blog.");
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      return toast.error("Failed to delete blog.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Card key={blog._id} className="relative">
            <CardContent>
              <CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger className="absolute right-2">
                    <EllipsisVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Button onClick={() => deleteBlog(blog._id)}>
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <img src={blog.imageUrl} alt="" className="w-full h-full" />
              </CardTitle>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No blogs available.</p>
      )}
    </div>
  );
}
