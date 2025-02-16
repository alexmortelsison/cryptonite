"use client";
import { useState } from "react";
import CreateBlog from "../components/CreateBlog";
import BlogFeed from "../components/BlogFeed";

export default function DashboardPage() {
  const [refresh, setRefresh] = useState(false);

  const refreshBlogs = () => {
    setRefresh((prev) => !prev); 
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-center">Welcome to My Blog</h1>
      <div className="flex justify-end mt-4">
        <CreateBlog refreshBlogs={refreshBlogs} />
      </div>
      <BlogFeed refresh={refresh} />
    </main>
  );
}
