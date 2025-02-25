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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Blog {
  _id: string;
  title: string;
  overview: string;
  description: string;
  imageUrl: string;
}

export default function BlogFeed({ refresh }: { refresh: boolean }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);

  // Edit form states
  const [editTitle, setEditTitle] = useState("");
  const [editOverview, setEditOverview] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchBlogs = async () => {
    const response = await fetch("/api/blogs");
    const data = await response.json();
    setBlogs(data);
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
      if (!response.ok) throw new Error("Failed deleting blog");
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Delete blog error:", error);
      toast.error("Failed to delete blog.");
    }
  };

  const openEditDialog = (blog: Blog) => {
    setEditBlog(blog);
    setEditTitle(blog.title);
    setEditOverview(blog.overview);
    setEditDescription(blog.description);
    setEditImageUrl(blog.imageUrl);
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a file to upload.");
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Failed uploading file");
      setEditImageUrl(data.fileUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload file error:", error);
      toast.error("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!editBlog) return;
    try {
      const response = await fetch(`/api/blogs?id=${editBlog._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          overview: editOverview,
          description: editDescription,
          imageUrl: editImageUrl,
        }),
      });
      if (!response.ok) throw new Error("Failed to update blog.");
      const updatedBlog = await response.json();
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === editBlog._id ? updatedBlog : blog
        )
      );
      toast.success("Blog updated successfully!");
      setEditBlog(null);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update blog.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Card key={blog._id} className="relative">
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <EllipsisVerticalIcon className="absolute right-2 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      asChild
                      onClick={() => openEditDialog(blog)}
                    >
                      <Button variant="outline" className="w-full">
                        Edit
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      onClick={() => deleteBlog(blog._id)}
                    >
                      <Button variant="destructive" className="w-full">
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <img
                  src={blog.imageUrl}
                  alt="photo"
                  className="w-full h-40 object-cover"
                />
              </CardContent>
              <CardTitle className="flex justify-center my-4">
                {blog.title}
              </CardTitle>
              <CardDescription className="flex text-center px-4 my-2">
                {blog.overview}
              </CardDescription>
            </Card>
          ))
        ) : (
          <p>No blogs available.</p>
        )}
      </div>

      {/* Edit Blog Dialog: Rendered only when a blog is selected */}
      {editBlog && (
        <Dialog open>
          <DialogContent>
            <DialogTitle>Edit Blog</DialogTitle>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="block text-sm font-medium">Title</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Overview</Label>
                <Input
                  value={editOverview}
                  onChange={(e) => setEditOverview(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Description</Label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Image</Label>
                <img
                  src={editImageUrl}
                  alt="Current"
                  className="w-full h-40 object-cover mb-2"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-2"
                >
                  {uploading ? "Uploading..." : "Upload New Image"}
                </Button>
              </div>
            </div>
            <DialogFooter className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => setEditBlog(null)}>Cancel</Button>
              <Button onClick={handleUpdateSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
