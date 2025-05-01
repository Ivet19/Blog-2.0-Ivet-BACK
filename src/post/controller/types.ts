import { NextFunction, Request, Response } from "express";
import { GetPostsResponseBody } from "../types.js";

export interface PostControllerStructure {
  getPostsPage: (req: PostRequest, res: Response) => Promise<void>;
  addPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deletePost: (
    req: PostRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

export type PostRequest = Request<
  PostParams,
  Record<string, GetPostsResponseBody>,
  Record<string, unknown>,
  PostQuery
>;

export type PostQuery = {
  page: string;
};

export type PostParams = {
  postId: string;
};
