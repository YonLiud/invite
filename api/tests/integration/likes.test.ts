import request from "supertest";
import { createTestApp } from "../utils/test-app";
import { clearTestDatabase } from "../utils/test-helpers";

describe("Likes API", () => {
  let app: any;
  let authToken: string;
  let postId: number;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await clearTestDatabase();

    // Register and login a user
    const registerResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser123",
        password: "password123",
        display_name: "Test User",
      })
      .expect(201);

    authToken = registerResponse.body.data.accessToken;

    // Create a post
    const postResponse = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        content: "Test post for likes",
      })
      .expect(201);

    postId = postResponse.body.data.id;
  });

  describe("POST /likes", () => {
    it("should like a post successfully", async () => {
      const response = await request(app)
        .post("/likes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          postId: postId,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.post_id).toBe(postId);
      expect(response.body.data.author.username).toBe("testuser123");
    });

    it("should return 401 for unauthorized like", async () => {
      const response = await request(app)
        .post("/likes")
        .send({
          postId: postId,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return 422 for missing postId", async () => {
      const response = await request(app)
        .post("/likes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({})
        .expect(422);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /likes/:postId", () => {
    beforeEach(async () => {
      // Like the post first
      await request(app)
        .post("/likes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          postId: postId,
        })
        .expect(200);
    });

    it("should unlike a post successfully", async () => {
      const response = await request(app)
        .delete(`/likes/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Post unliked successfully");
    });

    it("should return 401 for unauthorized unlike", async () => {
      const response = await request(app)
        .delete(`/likes/${postId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /likes/post/:postId", () => {
    it("should return likes for post", async () => {
      // Like the post
      await request(app)
        .post("/likes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          postId: postId,
        })
        .expect(200);

      const response = await request(app)
        .get(`/likes/post/${postId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.likes).toBeDefined();
      expect(response.body.data.count).toBe(1);
    });

    it("should return empty likes for post with no likes", async () => {
      const response = await request(app)
        .get(`/likes/post/${postId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.likes).toHaveLength(0);
      expect(response.body.data.count).toBe(0);
    });
  });

  describe("GET /likes/check/:postId", () => {
    it("should return liked status for post", async () => {
      // Check before liking
      const beforeResponse = await request(app)
        .get(`/likes/check/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(beforeResponse.body.success).toBe(true);
      expect(beforeResponse.body.data.liked).toBe(false);

      // Like the post
      await request(app)
        .post("/likes")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          postId: postId,
        })
        .expect(200);

      // Check after liking
      const afterResponse = await request(app)
        .get(`/likes/check/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(afterResponse.body.success).toBe(true);
      expect(afterResponse.body.data.liked).toBe(true);
    });
  });
});
