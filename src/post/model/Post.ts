import { model, Schema } from "mongoose";
import { PostStructure } from "../types.js";

const postSchema = new Schema<PostStructure>({
  publishDate: {
    type: Date,
    default: new Date(),
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: ["food"],
  },
  content: {
    type: String,
    required: true,
  },
  smallImageUrl: {
    type: String,
    required: true,
  },
  detailImageUrl: {
    type: String,
  },
});

const Post = model("Post", postSchema, "ivet_posts");

export default Post;
