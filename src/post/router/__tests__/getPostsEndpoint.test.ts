import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase.js";
import Post from "../../model/Post.js";
import { attackOnTitanMeatPost, bleachSushiPost } from "../../fixtures.js";
import app from "../../../server/app.js";
import { GetPostsResponseBody } from "../../types.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const mongoBdConnectionString = server.getUri();

  await connectToDatabase(mongoBdConnectionString);
});

afterAll(async () => {
  mongoose.disconnect();
  await server.stop();
});

describe("Given the GET/posts endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status code and Carne para titanes hambrientos 🍖🛡️ and Sushi espiritual para Shinigamis 🍣🗡️ posts", async () => {
      await Post.create(attackOnTitanMeatPost, bleachSushiPost);

      const response = await request(app).get("/posts");
      const body = response.body as GetPostsResponseBody;

      expect(response.status).toBe(200);
      expect(body.posts).toContainEqual(
        expect.objectContaining({
          title: "Carne para titanes hambrientos 🍖🛡️",
        }),
      );
      expect(body.posts).toContainEqual(
        expect.objectContaining({
          title: "Sushi espiritual para Shinigamis 🍣🗡️",
        }),
      );
    });
  });
});
