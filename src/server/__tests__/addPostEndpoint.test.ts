import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../database/connectToDatabase.js";
import Post from "../../post/model/Post.js";
import {
  attackOnTitanMeatPost,
  bleachSushiPost,
  paellaMariscosPost,
} from "../../post/fixtures.js";
import { addPostResponseBody } from "../../post/types.js";
import app from "../app.js";
import { paellaMariscosPostData } from "../../post/postDataFixtures.js";

let server: MongoMemoryServer;

beforeEach(async () => {
  server = await MongoMemoryServer.create();
  const mongoBdConnectionString = server.getUri();

  await connectToDatabase(mongoBdConnectionString);
});

afterEach(async () => {
  mongoose.disconnect();
  await server.stop();
});

describe("Given the POST/posts endpoint", () => {
  describe("When it receives a request with 'Paella de Mariscos en El Palmar' post data", () => {
    test("Then it should respond with a 201 status code and 'Paella de Mariscos en El Palmar' post", async () => {
      await Post.create(attackOnTitanMeatPost, bleachSushiPost);

      const newPost = paellaMariscosPostData;

      const response = await request(app).post("/posts").send(newPost);
      const body = response.body as addPostResponseBody;

      expect(response.status).toBe(201);
      expect(body.post).toEqual(
        expect.objectContaining({
          title: newPost.title,
        }),
      );

      const dataBasePosts = await Post.find();
      expect(dataBasePosts).toHaveLength(3);
    });
  });

  describe("When it receives a request with already existing 'Paella de Mariscos en El Palmar' post data", () => {
    test("Then it should respond with a 409 status code and 'Post already exists' error message", async () => {
      await Post.create(
        attackOnTitanMeatPost,
        bleachSushiPost,
        paellaMariscosPost,
      );

      const newPost = paellaMariscosPostData;

      const response = await request(app).post("/posts").send(newPost);
      const body = response.body as { error: string };

      expect(response.status).toBe(409);
      expect(body.error).toBe("Post already exists");

      const dataBasePosts = await Post.find();
      expect(dataBasePosts).toHaveLength(3);
    });
  });
});
