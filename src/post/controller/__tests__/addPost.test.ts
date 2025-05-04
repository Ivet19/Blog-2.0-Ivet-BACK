import { Model } from "mongoose";
import { NextFunction } from "express";
import { Request, Response } from "express";
import ServerError from "../../../server/ServerError/ServerError.js";
import { PostStructure } from "../../types.js";
import PostController from "../PostController.js";
import {
  huevosRotosBruc159PostData,
  paellaMariscosPostData,
  paellaMariscosWithoutTagsPostData,
} from "../../postDataFixtures.js";
import {
  animeFoodPosts,
  huevosRotosBruc159Post,
  paellaMariscosPost,
  paellaMariscosWithoutTagsPost,
} from "../../fixtures.js";

let req: Pick<Request, "body">;

beforeEach(() => {
  req = {
    body: { ...paellaMariscosPostData },
  } as Pick<Request, "body">;

  jest.clearAllMocks();
});

describe("Given the addPost method of PostController", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Pick<Response, "status" | "json">;

  const next: NextFunction = jest.fn();

  describe("When it receives 'Paella de Mariscos en El Palmar' post data", () => {
    const postModel: Pick<Model<PostStructure>, "find" | "insertOne"> = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(animeFoodPosts),
      }),
      insertOne: jest.fn().mockResolvedValue(paellaMariscosPost),
    };

    const postController = new PostController(
      postModel as Model<PostStructure>,
    );
    test("Then it should call the response's method status with 201", async () => {
      await postController.addPost(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("Then it should call the response's method json with Paella de Mariscos en El Palmar completed post", async () => {
      await postController.addPost(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(res.json).toHaveBeenCalledWith({ post: paellaMariscosPost });
    });

    describe("And post data includes an image without alternative text", () => {
      test("Then it should return 'Paella de Mariscos: disfruta de la mejor paella en El Palmar post with 'Plato de Paella de Mariscos' as image alternative text", async () => {
        const postModel: Pick<Model<PostStructure>, "find" | "insertOne"> = {
          find: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(animeFoodPosts),
          }),
          insertOne: jest.fn().mockResolvedValue(paellaMariscosPost),
        };

        const postController = new PostController(
          postModel as Model<PostStructure>,
        );

        await postController.addPost(
          req as Request,
          res as Response,
          next as NextFunction,
        );

        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            post: expect.objectContaining({
              imageAlt: "Plato de Paella de Mariscos",
            }),
          }),
        );
      });
    });

    describe("And post data includes 'paella, mariscos, el palmar, valencia' tags", () => {
      test("Then it should return 'Paella de Mariscos: disfruta de la mejor paella en El Palmar post with 'paella', 'mariscos', 'elpalmar' and 'valencia' as tags", async () => {
        const postModel: Pick<Model<PostStructure>, "find" | "insertOne"> = {
          find: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(animeFoodPosts),
          }),
          insertOne: jest.fn().mockResolvedValue(paellaMariscosPost),
        };

        const postController = new PostController(
          postModel as Model<PostStructure>,
        );

        await postController.addPost(
          req as Request,
          res as Response,
          next as NextFunction,
        );

        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            post: expect.objectContaining({
              tags: ["paella", "mariscos", "elpalmar", "valencia"],
            }),
          }),
        );
      });
    });

    describe("And post data doesn't include any tag", () => {
      test("Then it should return 'Paella de Mariscos: disfruta de la mejor paella en El Palmar post with 'food' as default tag", async () => {
        const req = {
          body: paellaMariscosWithoutTagsPostData,
        } as Pick<Request, "body">;

        const postModel: Pick<Model<PostStructure>, "find" | "insertOne"> = {
          find: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(animeFoodPosts),
          }),
          insertOne: jest.fn().mockResolvedValue(paellaMariscosWithoutTagsPost),
        };

        const postController = new PostController(
          postModel as Model<PostStructure>,
        );

        await postController.addPost(
          req as Request,
          res as Response,
          next as NextFunction,
        );

        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            post: expect.objectContaining({
              tags: ["food"],
            }),
          }),
        );
      });
    });
  });

  describe("When it receives the existent 'Huevos rotos: el mejor plato de Bruc, 159' post data", () => {
    test("Then it should call the response's method status with a 409 and a 'Post already exists' message", async () => {
      const req = {
        body: huevosRotosBruc159PostData,
      } as Pick<Request, "body">;

      const postModel: Pick<Model<PostStructure>, "find" | "insertOne"> = {
        find: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(animeFoodPosts),
        }),
        insertOne: jest.fn().mockResolvedValue(huevosRotosBruc159Post),
      };

      const error = new ServerError(409, "Post already exists");

      const postController = new PostController(
        postModel as Model<PostStructure>,
      );

      await postController.addPost(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
