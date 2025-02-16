/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateBlog({
  refreshBlogs,
}: {
  refreshBlogs: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const resetForm = () => {
    setFile(null);
    setFileUrl(null);
    setTitle("");
    setOverview("");
    setDescription("");
    setOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      setFileUrl(data.fileUrl);
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !overview || !description || !fileUrl) {
      return alert("All fields are required!");
    }

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          overview,
          description,
          imageUrl: fileUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to create blog");

      alert("Blog created successfully!");
      refreshBlogs();
      resetForm();
    } catch (error) {
      console.error("❌ Error submitting blog:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Blog +</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <p>Title</p>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <p>Overview</p>
          <Input
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
          />
          <p>Description</p>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p>Image</p>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {fileUrl && (
            <img
              src={fileUrl}
              alt="Uploaded"
              className="w-32 h-32 object-cover mt-2"
            />
          )}
        </DialogTitle>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload Image"}
          </Button>
          <Button onClick={handleSubmit} disabled={!fileUrl}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
