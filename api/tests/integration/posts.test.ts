import request from "supertest";
import { createTestApp } from "../utils/test-app";
import { clearTestDatabase } from "../utils/test-helpers";

describe("Posts API", () => {
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
        content: "Test post content",
      })
      .expect(201);
    postId = postResponse.body.data.id;
  });

  describe("POST /posts", () => {
    it("should create a new post successfully", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "Another test post",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe("Another test post");
      // Ensure the author object is correctly populated by the service
      expect(response.body.data.author).toBeDefined();
      expect(response.body.data.author.username).toBe("testuser123");
    });

    it("should return 401 for unauthorized post creation", async () => {
      const response = await request(app)
        .post("/posts")
        .send({
          content: "Unauthorized post",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return 422 for empty content", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "",
        })
        .expect(422);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /posts", () => {
    it("should return list of posts", async () => {
      // FIXED: Added Authorization header
      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${authToken}`) // <- Added this line
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.posts).toBeDefined();
      expect(Array.isArray(response.body.data.posts)).toBe(true);
    });

    it("should return posts with pagination", async () => {
      // FIXED: Added Authorization header
      const response = await request(app)
        .get("/posts?page=1&limit=5")
        .set("Authorization", `Bearer ${authToken}`) // <- Added this line
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.posts).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });
  });

  describe("GET /posts/:id", () => {
    it("should return post by ID", async () => {
      const response = await request(app).get(`/posts/${postId}`).expect(200); // Assuming this endpoint doesn't require auth, otherwise add header

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(postId);
      expect(response.body.data.content).toBe("Test post content");
    });

    it("should return 404 for non-existent post", async () => {
      const response = await request(app).get("/posts/99999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Post not found");
    });
  });

  describe("GET /posts/user/:username", () => {
    it("should return posts by username", async () => {
      // FIXED: Added Authorization header
      const response = await request(app)
        .get("/posts/user/testuser123")
        .set("Authorization", `Bearer ${authToken}`) // <- Added this line
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.posts).toBeDefined();
      expect(Array.isArray(response.body.data.posts)).toBe(true);
    });
  });

  describe("PUT /posts/:id", () => {
    it("should update own post successfully", async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "Updated post content",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe("Updated post content");
      // Ensure the author object is correctly populated by the service
      expect(response.body.data.author).toBeDefined();
    });

    it("should return 401 for unauthorized post update", async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({
          content: "Hacked content",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 for non-existent post", async () => {
      const response = await request(app)
        .put("/posts/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "Updated content",
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /posts/:id", () => {
    it("should delete own post successfully", async () => {
      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Post deleted successfully");
    });

    it("should return 401 for unauthorized post deletion", async () => {
      const response = await request(app)
        .delete(`/posts/${postId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 for already deleted post", async () => {
      // Delete post first
      await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Try to delete again
      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
