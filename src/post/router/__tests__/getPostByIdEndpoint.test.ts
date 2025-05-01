import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import connectToDatabase from "../../../database/connectToDatabase.js";
import Post from "../../model/Post.js";
import { attackOnTitanMeatPost, bleachSushiPost } from "../../fixtures.js";
import app from "../../../server/app.js";
import { postResponseBody } from "../../types.js";

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

describe("Given the GET/posts/123456789123456789123456 endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status code and Carne para titanes hambrientos 🍖🛡️ post", async () => {
      await Post.create(attackOnTitanMeatPost, bleachSushiPost);

      const response = await request(app).get(
        "/posts/123456789123456789123456",
      );
      const body = response.body as postResponseBody;

      expect(response.status).toBe(200);
      expect(body.post).toEqual(
        expect.objectContaining({
          title: "Carne para titanes hambrientos 🍖🛡️",
        }),
      );
    });
  });
});

describe("Given the GET/posts/000 endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 406 status code and a 'Not valid id' error message", async () => {
      await Post.create(attackOnTitanMeatPost, bleachSushiPost);

      const response = await request(app).get("/posts/000");
      const body = response.body as { error: string };

      expect(response.status).toBe(406);
      expect(body.error).toBe("Id not valid");
    });
  });
});

describe("Given the GET/posts/573561324567825367892345 endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 404 status code and a 'Post not found' error message", async () => {
      await Post.create(attackOnTitanMeatPost, bleachSushiPost);

      const response = await request(app).get(
        "/posts/573561324567825367892345",
      );
      const body = response.body as { error: string };

      expect(response.status).toBe(404);
      expect(body.error).toBe("Post not found");
    });
  });
});
