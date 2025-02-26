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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CameraIcon, EllipsisVerticalIcon } from "lucide-react";
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
  const [editBlog, setEditBlog] = useState<Blog | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editOverview, setEditOverview] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBlogs = async () => {
    const response = await fetch("/api/blogs", {
      method: "GET",
    });
    const data = await response.json();
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, [refresh]);

  const deleteBlog = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const response = await fetch(`api/blogs?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete blog.");
      setBlogs((prevBlog) => prevBlog.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Delete blog error:", error);
      return toast.error("Failed to delete blog.");
    }
  };

  const openEditDialog = (blog: Blog) => {
    setEditBlog(blog);
    setEditTitle(blog.title);
    setEditOverview(blog.overview);
    setEditDescription(blog.description);
    setEditImageUrl(blog.imageUrl);
    setFile(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditBlog(null);
    setIsDialogOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a file.");
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload file.");
      setEditImageUrl(data.fileUrl);
    } catch (error) {
      console.error("File upload error:", error);
      return toast.error("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!editBlog) return;
    try {
      const response = await fetch(`api/blogs?id=${editBlog._id}`, {
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
      console.error("Update blog error:", error);
      return toast.error("Failed to update blog.");
    }
  };

  const resetImage = () => {
    setEditImageUrl("");
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

      {editBlog && (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <Label className=" flex justify-center mb-4">
              {editImageUrl ? (
                <img src={editImageUrl} alt="photo" onClick={resetImage} />
              ) : (
                <div>
                  <CameraIcon size={45} />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </Label>
            <DialogTitle>
              <p className="mb-2">Title</p>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </DialogTitle>
            <DialogTitle>
              <p className="mb-2">Overview</p>
              <Input
                value={editOverview}
                onChange={(e) => setEditOverview(e.target.value)}
              />
            </DialogTitle>
            <DialogTitle>
              <p className="mb-2">Description</p>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </DialogTitle>
            <DialogFooter className="mt-4">
              <Button onClick={handleUpload}>
                {loading ? "Uploading..." : "Upload"}
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
