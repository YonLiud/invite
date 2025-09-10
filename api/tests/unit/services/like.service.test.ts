import { LikeService } from "../../../src/services/LikeService";
import { clearTestDatabase, createTestUser, createTestPost } from "../../utils/test-helpers";

describe('LikeService', () => {
  let likeService: LikeService;
  let testUser: any;
  let testPost: any;

  beforeAll(() => {
    likeService = new LikeService();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    testUser = await createTestUser({
      username: 'testuser_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      password: 'password123',
      displayName: 'Test User'
    });
    testPost = await createTestPost({
      content: 'Test post for likes',
      authorId: testUser.id
    });
  });

  describe('likePost', () => {
    it('should create a new like successfully', async () => {
      const result = await likeService.likePost(testUser.id, testPost.id);
      
      expect(result).toBeDefined();
      if (result) {
        expect(result.author.id).toBe(testUser.id);
        expect(result.post.id).toBe(testPost.id);
      }
    });

    it('should return existing like when liking twice', async () => {
      // First like
      const firstLike = await likeService.likePost(testUser.id, testPost.id);
      
      // Second like (should return same like)
      const secondLike = await likeService.likePost(testUser.id, testPost.id);
      
      expect(secondLike).toBeDefined();
      if (firstLike && secondLike) {
        expect(secondLike.id).toBe(firstLike.id);
      }
    });
  });

  describe('unlikePost', () => {
    it('should remove like successfully', async () => {
      // First like
      const like = await likeService.likePost(testUser.id, testPost.id);
      expect(like).toBeDefined();
      
      // Unlike
      const result = await likeService.unlikePost(testUser.id, testPost.id);
      expect(result).toBe(true);
      
      // Verify like is removed
      const hasLiked = await likeService.hasUserLikedPost(testUser.id, testPost.id);
      expect(hasLiked).toBe(false);
    });

    it('should return false for non-existent like', async () => {
      const result = await likeService.unlikePost(testUser.id, testPost.id);
      expect(result).toBe(false);
    });
  });

  describe('hasUserLikedPost', () => {
    it('should return true when user has liked post', async () => {
      await likeService.likePost(testUser.id, testPost.id);
      const result = await likeService.hasUserLikedPost(testUser.id, testPost.id);
      expect(result).toBe(true);
    });

    it('should return false when user has not liked post', async () => {
      const result = await likeService.hasUserLikedPost(testUser.id, testPost.id);
      expect(result).toBe(false);
    });
  });

  describe('getLikesCountForPost', () => {
    it('should return correct like count', async () => {
      // Create another user
      const anotherUser = await createTestUser({
        username: 'anotheruser_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        password: 'password123',
        displayName: 'Another User'
      });
      
      // Like post with both users
      await likeService.likePost(testUser.id, testPost.id);
      await likeService.likePost(anotherUser.id, testPost.id);
      
      const count = await likeService.getLikesCountForPost(testPost.id);
      expect(count).toBe(2);
    });
  });
});