import { PostService } from "../../../src/services/PostService";
import {
  clearTestDatabase,
  createTestUser,
  generateUniqueUsername,
} from "../../utils/test-helpers";
import { AppDataSource } from "../../../src/data-source";
import { Profile } from "../../../src/entities/Profile";

describe("PostService", () => {
  let postService: PostService;
  let testUser: Profile;

  beforeAll(() => {
    postService = new PostService();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    testUser = await createTestUser({
      username: generateUniqueUsername(), // Always unique
      password: "password123",
      display_name: "Test User",
    });
  });

  describe("createPost", () => {
    it("should create a new post successfully", async () => {
      const post = await postService.createPost(
        testUser.id,
        "Hello world! This is a test post.",
      );

      expect(post).toBeDefined();
      expect(post.content).toBe("Hello world! This is a test post.");
      expect(post.author.id).toBe(testUser.id);
      expect(post.id).toBeDefined();
      expect(post.created_at).toBeDefined();
    });

    it("should handle empty content", async () => {
      const post = await postService.createPost(testUser.id, "");
      expect(post).toBeDefined();
      expect(post.content).toBe("");
    });
  });

  describe("getPostsByAuthor", () => {
    beforeEach(async () => {
      // Create some test posts
      await postService.createPost(testUser.id, "Post 1");
      await postService.createPost(testUser.id, "Post 2");
      await postService.createPost(testUser.id, "Post 3");
    });

    it("should return posts for author", async () => {
      const posts = await postService.getPostsByAuthorId(testUser.id, 10);

      expect(posts).toHaveLength(3);
      expect(posts[0].content).toBe("Post 3"); // Most recent first
      expect(posts[1].content).toBe("Post 2");
      expect(posts[2].content).toBe("Post 1");
    });

    it("should respect limit parameter", async () => {
      const posts = await postService.getPostsByAuthorId(testUser.id, 2);
      expect(posts).toHaveLength(2);
    });
  });

  describe("getAllPosts", () => {
    beforeEach(async () => {
      // Create another user and posts
      const anotherUser = await createTestUser({
        username: "anotheruser",
        password: "password123",
        display_name: "Another User",
      });

      await postService.createPost(testUser.id, "Test user post 1");
      await postService.createPost(anotherUser.id, "Another user post 1");
      await postService.createPost(testUser.id, "Test user post 2");
    });

    it("should return all posts with pagination", async () => {
      const result = await postService.getAllPosts(1, 2);

      expect(result.posts).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    it("should return posts ordered by creation date", async () => {
      const result = await postService.getAllPosts(1, 10);

      expect(result.posts).toHaveLength(3);
      // Posts should be ordered by created_at DESC (most recent first)
      expect(result.posts[0].created_at.getTime()).toBeGreaterThanOrEqual(
        result.posts[1].created_at.getTime(),
      );
    });
  });

  describe("getPostById", () => {
    it("should return post by ID", async () => {
      const post = await postService.createPost(testUser.id, "Test post");
      const foundPost = await postService.getPostById(post.id);

      expect(foundPost).toBeDefined();
      expect(foundPost?.id).toBe(post.id);
      expect(foundPost?.content).toBe("Test post");
      expect(foundPost?.author.id).toBe(testUser.id);
    });

    it("should return null for non-existent post", async () => {
      const post = await postService.getPostById(99999);
      expect(post).toBeNull();
    });
  });

  describe("updatePost", () => {
    it("should update post content", async () => {
      const post = await postService.createPost(
        testUser.id,
        "Original content",
      );
      const updatedPost = await postService.updatePost(
        post.id,
        testUser.id,
        "Updated content",
      );

      expect(updatedPost).toBeDefined();
      expect(updatedPost?.content).toBe("Updated content");
      expect(updatedPost?.id).toBe(post.id);
    });

    it("should return null for non-existent post", async () => {
      const result = await postService.updatePost(
        99999,
        testUser.id,
        "New content",
      );
      expect(result).toBeNull();
    });

    it("should return null for post belonging to different user", async () => {
      const anotherUser = await createTestUser({
        username: "anotheruser",
        password: "password123",
        display_name: "Another User",
      });

      const post = await postService.createPost(testUser.id, "Test post");
      const result = await postService.updatePost(
        post.id,
        anotherUser.id,
        "Hacked content",
      );

      expect(result).toBeNull();
    });
  });

  describe("deletePost", () => {
    it("should delete post successfully", async () => {
      const post = await postService.createPost(testUser.id, "Test post");
      const result = await postService.deletePost(post.id, testUser.id);

      expect(result).toBe(true);

      // Verify post is deleted
      const deletedPost = await postService.getPostById(post.id);
      expect(deletedPost).toBeNull();
    });

    it("should return false for non-existent post", async () => {
      const result = await postService.deletePost(99999, testUser.id);
      expect(result).toBe(false);
    });

    it("should return false for post belonging to different user", async () => {
      const anotherUser = await createTestUser({
        username: "anotheruser",
        password: "password123",
        display_name: "Another User",
      });

      const post = await postService.createPost(testUser.id, "Test post");
      const result = await postService.deletePost(post.id, anotherUser.id);

      expect(result).toBe(false);

      // Verify post still exists
      const existingPost = await postService.getPostById(post.id);
      expect(existingPost).toBeDefined();
    });
  });
});
