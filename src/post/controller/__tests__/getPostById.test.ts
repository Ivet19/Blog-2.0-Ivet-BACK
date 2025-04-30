import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { luffyBentoPost } from "../../fixtures.js";
import { luffyBentoPostDto } from "../../dto/fixtures.js";
import { PostStructure } from "../../types.js";
import PostController from "../PostController.js";
import { PostRequest } from "../types.js";
import ServerError from "../../../server/ServerError/ServerError.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the getPostById method of PostController", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Pick<Response, "status" | "json">;

  const next = jest.fn();

  describe("When it receives a request with Luffys Bento Post id that already exists in the dabase", () => {
    const req = {
      params: { postId: luffyBentoPost._id },
    } as Pick<Request, "params">;

    const postModel: Pick<Model<PostStructure>, "findById"> = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(luffyBentoPostDto),
      }),
    };

    test("Then is should call the received response's method status with 200", async () => {
      const expectedStatus = 200;

      const controller = new PostController(postModel as Model<PostStructure>);

      await controller.getPostById(
        req as PostRequest,
        res as Response,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the received response's methos json with Luffys Bento Post", async () => {
      const controller = new PostController(postModel as Model<PostStructure>);

      await controller.getPostById(
        req as PostRequest,
        res as Response,
        next as NextFunction,
      );

      expect(res.json).toHaveBeenCalledWith({ post: luffyBentoPostDto });
    });
  });

  describe("When it receives a request with Patatas a la riojana id that is not valid", () => {
    const req = {
      params: { postId: "patatas-riojana" },
    } as Pick<Request, "params">;

    const postModel: Pick<Model<PostStructure>, "findById"> = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    };
    test("Then it should call the received next method with 406, 'Id not valid' error", async () => {
      const error = new ServerError(406, "Id not valid");
      const postController = new PostController(
        postModel as Model<PostStructure>,
      );

      await postController.getPostById(
        req as PostRequest,
        res as Response,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When you receive a request with id of Cocido Madrileño that doesn't exist in the database", () => {
    const req = {
      params: { postId: "cocidomadrileñoriquisimo" },
    } as Pick<Request, "params">;

    const postModel: Pick<Model<PostStructure>, "findById"> = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    };

    test("Then it should call the received next method with 404 'Post not found' error", async () => {
      const error = new ServerError(404, "Post not found");

      const postController = new PostController(
        postModel as Model<PostStructure>,
      );

      await postController.getPostById(
        req as PostRequest,
        res as Response,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
