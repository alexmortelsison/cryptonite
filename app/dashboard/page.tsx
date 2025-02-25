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
    <div className="max-w-5xl mx-auto my-8 space-y-4">
      <CreateBlog refreshBlogs={refreshBlogs} />
      <BlogFeed refresh={refresh} />
    </div>
  );
}
