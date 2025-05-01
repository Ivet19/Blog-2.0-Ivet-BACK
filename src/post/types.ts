export interface PostStructure {
  _id: string;
  publishDate: Date;
  author: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  content: string;
  smallImageUrl: string;
  detailImageUrl: string;
}

export type PostData = Omit<PostStructure, "_id" | "publishDate" | "tags"> & {
  publishDate?: string;
  tags?: string | string[];
};

export interface GetPostsResponseBody {
  posts: PostStructure[];
  postsTotal: number;
}

export interface postResponseBody {
  post: PostStructure;
}
