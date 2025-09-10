import { CommentService } from "../../../src/services/CommentService";
import { clearTestDatabase, createTestUser, createTestPost } from "../../utils/test-helpers";

describe('CommentService', () => {
  let commentService: CommentService;
  let testUser: any;
  let testPost: any;

  beforeAll(() => {
    commentService = new CommentService();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    testUser = await createTestUser({
      username: 'testuser_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      password: 'password123',
      display_name: 'Test User'
    });
    testPost = await createTestPost({
      content: 'Test post for comments',
      authorId: testUser.id
    });
  });

  describe('createComment', () => {
    it('should create a new comment successfully', async () => {
      const comment = await commentService.createComment(
        testUser.id,
        testPost.id,
        'This is a test comment!'
      );

      expect(comment).toBeDefined();
      if (comment) {
        expect(comment.content).toBe('This is a test comment!');
        expect(comment.author.id).toBe(testUser.id);
        expect(comment.post.id).toBe(testPost.id);
        expect(comment.id).toBeDefined();
      }
    });
  });

  describe('getCommentsByPost', () => {
    beforeEach(async () => {
      // Create comments with small delay for timestamp difference
      await commentService.createComment(testUser.id, testPost.id, 'Comment 1');
      await new Promise(resolve => setTimeout(resolve, 10));
      await commentService.createComment(testUser.id, testPost.id, 'Comment 2');
    });

    it('should return comments for post', async () => {
      const comments = await commentService.getCommentsByPost(testPost.id, 10);
      
      expect(comments).toHaveLength(2);
      // Comments should be ordered by created_at ASC (oldest first)
      expect(comments[0].content).toBe('Comment 1');
      expect(comments[1].content).toBe('Comment 2');
    });
  });

  describe('updateComment', () => {
    it('should update comment content', async () => {
      const comment = await commentService.createComment(
        testUser.id,
        testPost.id,
        'Original comment'
      );
      
      expect(comment).toBeDefined();
      if (comment) {
        const updatedComment = await commentService.updateComment(
          comment.id,
          testUser.id,
          'Updated comment'
        );
        
        expect(updatedComment).toBeDefined();
        if (updatedComment) {
          expect(updatedComment.content).toBe('Updated comment');
        }
      }
    });

    it('should return null for comment by different user', async () => {
      // Create another user
      const anotherUser = await createTestUser({
        username: 'anotheruser_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        password: 'password123',
        display_name: 'Another User'
      });
      
      const comment = await commentService.createComment(
        testUser.id,
        testPost.id,
        'Test comment'
      );
      
      expect(comment).toBeDefined();
      if (comment) {
        const result = await commentService.updateComment(
          comment.id,
          anotherUser.id,
          'Hacked comment'
        );
        
        expect(result).toBeNull();
      }
    });
  });

  describe('deleteComment', () => {
    it('should delete comment successfully', async () => {
      const comment = await commentService.createComment(
        testUser.id,
        testPost.id,
        'Test comment'
      );
      
      expect(comment).toBeDefined();
      if (comment) {
        const result = await commentService.deleteComment(comment.id, testUser.id);
        expect(result).toBe(true);
        
        // Verify comment is deleted
        const deletedComment = await commentService.getCommentById(comment.id);
        expect(deletedComment).toBeNull();
      }
    });
  });
});