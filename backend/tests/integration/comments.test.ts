import request from "supertest";
import { createTestApp } from "../utils/test-app";
import { clearTestDatabase } from "../utils/test-helpers";

describe("Comments API", () => {
  let app: any;
  let authToken: string;
  let postId: number;
  let commentId: number;

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
        content: "Test post for comments",
      })
      .expect(201);
    postId = postResponse.body.data.id;

    // Create a comment
    const commentResponse = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        postId: postId,
        content: "Test comment",
      })
      .expect(201);
    commentId = commentResponse.body.data.id;
  });

  describe("POST /comments", () => {
    it("should create a new comment successfully", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          postId: postId,
          content: "Another test comment",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe("Another test comment");
      expect(response.body.data.author.username).toBe("testuser123");
    });

    it("should return 401 for unauthorized comment creation", async () => {
      const response = await request(app)
        .post("/comments")
        .send({
          postId: postId,
          content: "Unauthorized comment",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should return 422 for missing postId", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "Comment without postId",
        })
        .expect(422);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /comments/post/:postId", () => {
    it("should return comments for post", async () => {
      // Note: This endpoint might not require auth, but if it does, add the header
      const response = await request(app)
        .get(`/comments/post/${postId}`)
        .expect(200); // Add .set('Authorization', ...) if needed

      expect(response.body.success).toBe(true);
      expect(response.body.data.comments).toBeDefined();
      expect(Array.isArray(response.body.data.comments)).toBe(true);
    });

    it("should return empty array for post with no comments", async () => {
      // Create another post without comments
      const postResponse = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "Post without comments",
        })
        .expect(201);
      const newPostId = postResponse.body.data.id;

      const response = await request(app)
        .get(`/comments/post/${newPostId}`)
        .expect(200); // Add .set('Authorization', ...) if needed

      expect(response.body.success).toBe(true);
      expect(response.body.data.comments).toHaveLength(0);
    });
  });

  describe("GET /comments/:id", () => {
    it("should return comment by ID", async () => {
      const response = await request(app)
        .get(`/comments/${commentId}`)
        .expect(200); // Add .set('Authorization', ...) if needed

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(commentId);
      expect(response.body.data.content).toBe("Test comment");
    });

    it("should return 404 for non-existent comment", async () => {
      const response = await request(app).get("/comments/99999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Comment not found");
    });
  });

  describe("PUT /comments/:id", () => {
    it("should update own comment successfully", async () => {
      const response = await request(app)
        .put(`/comments/${commentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "Updated comment content",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe("Updated comment content");
      // Ensure the author and post objects are correctly populated by the service
      expect(response.body.data.author).toBeDefined();
      expect(response.body.data.post_id).toBeDefined();
    });

    it("should return 401 for unauthorized comment update", async () => {
      const response = await request(app)
        .put(`/comments/${commentId}`)
        .send({
          content: "Hacked content",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /comments/:id", () => {
    it("should delete own comment successfully", async () => {
      const response = await request(app)
        .delete(`/comments/${commentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Comment deleted successfully");
    });

    it("should return 401 for unauthorized comment deletion", async () => {
      const response = await request(app)
        .delete(`/comments/${commentId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
