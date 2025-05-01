import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase.js";
import Post from "../../model/Post.js";
import { attackOnTitanMeatPost, bleachSushiPost } from "../../fixtures.js";
import { postResponseBody } from "../../types.js";
import app from "../../../server/app.js";

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

describe("Given the DELETE/posts/123456789123456789123454 endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status code and 'Sushi espiritual para Shinigamis 🍣🗡️' post", async () => {
      await Post.create(attackOnTitanMeatPost, bleachSushiPost);

      const response = await request(app).delete(
        `/posts/${bleachSushiPost._id}`,
      );
      const body = response.body as postResponseBody;

      expect(response.status).toBe(200);
      expect(body.post).toEqual(
        expect.objectContaining({
          _id: bleachSushiPost._id,
          title: "Sushi espiritual para Shinigamis 🍣🗡️",
        }),
      );

      const dataBasePosts = await Post.find();
      expect(dataBasePosts).toHaveLength(1);
    });
  });
});

describe("Given the DELETE/posts/573561324567825367892345 non existing post id endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 404 status code and a 'Post not found' error message", async () => {
      await Post.create(attackOnTitanMeatPost, bleachSushiPost);

      const response = await request(app).delete(
        "/posts/573561324567825367892345",
      );
      const body = response.body as { error: string };

      expect(response.status).toBe(404);
      expect(body.error).toBe("Post not found");
    });
  });
});
