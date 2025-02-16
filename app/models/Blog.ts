import { model, models, Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    overview: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;
