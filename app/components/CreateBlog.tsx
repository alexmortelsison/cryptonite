/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CameraIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateBlog({
  refreshBlogs,
}: {
  refreshBlogs: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFile(null);
    setFileUrl(null);
    setTitle("");
    setOverview("");
    setDescription("");
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
      setFileUrl(data.fileUrl);
    } catch (error) {
      console.error("File upload error:", error);
      return toast.error("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !overview || !description || !fileUrl) {
      return toast.error("All fields are required.");
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
      if (!response.ok) throw new Error("Failed to create blog.");
      toast.success("Blog created successfully!");
      refreshBlogs();
      resetForm();
    } catch (error) {
      console.error("Create blog error:", error);
      return toast.error("Failed to create blog.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          Create Blog
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Label className=" flex justify-center mb-4">
          {fileUrl ? (
            <img src={fileUrl} alt="photo" />
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
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </DialogTitle>
        <DialogTitle>
          <p className="mb-2">Overview</p>
          <Input
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
          />
        </DialogTitle>
        <DialogTitle>
          <p className="mb-2">Description</p>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
  );
}
