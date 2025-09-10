import { Profile } from "../../src/entities/Profile";
import { Post } from "../../src/entities/Post";
import { Comment } from "../../src/entities/Comment";
import { Like } from "../../src/entities/Like";
import { RefreshToken } from "../../src/entities/RefreshToken";
import { hashPassword } from "../../src/utils/password";
import { AppDataSource } from "../../src/data-source";

// Test user data factory
export interface TestUserData {
  username: string;
  password: string;
  displayName?: string;
}

// Test post data factory
export interface TestPostData {
  content: string;
  authorId: number;
}

// Test comment data factory
export interface TestCommentData {
  content: string;
  authorId: number;
  postId: number;
}

// Create a single test user
export const createTestUser = async (userData: TestUserData): Promise<Profile> => {
  const profileRepository = AppDataSource.getRepository(Profile);
  const password_hash = await hashPassword(userData.password);
  
  const profile = profileRepository.create({
    username: userData.username,
    password_hash,
    display_name: userData.displayName
  });
  
  return await profileRepository.save(profile);
};

// Create multiple test users
export const createTestUsers = async (users: TestUserData[]): Promise<Profile[]> => {
  return Promise.all(users.map(user => createTestUser(user)));
};

// Create a test post
export const createTestPost = async (postData: TestPostData): Promise<Post> => {
  const postRepository = AppDataSource.getRepository(Post);
  
  const post = postRepository.create({
    content: postData.content,
    author: { id: postData.authorId } as Profile
  });
  
  return await postRepository.save(post);
};

// Create multiple test posts
export const createTestPosts = async (posts: TestPostData[]): Promise<Post[]> => {
  return Promise.all(posts.map(post => createTestPost(post)));
};

// Create a test comment
export const createTestComment = async (commentData: TestCommentData): Promise<Comment> => {
  const commentRepository = AppDataSource.getRepository(Comment);
  
  const comment = commentRepository.create({
    content: commentData.content,
    author: { id: commentData.authorId } as Profile,
    post: { id: commentData.postId } as Post
  });
  
  return await commentRepository.save(comment);
};

// Create a test like
export const createTestLike = async (authorId: number, postId: number): Promise<Like> => {
  const likeRepository = AppDataSource.getRepository(Like);
  
  const like = likeRepository.create({
    author: { id: authorId } as Profile,
    post: { id: postId } as Post
  });
  
  return await likeRepository.save(like);
};

// Clear all test data (useful for beforeEach)
export const clearTestDatabase = async (): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Clear in correct order to avoid foreign key constraints
    await queryRunner.query('DELETE FROM "comment"');
    await queryRunner.query('DELETE FROM "like"');
    await queryRunner.query('DELETE FROM "post"');
    await queryRunner.query('DELETE FROM "refresh_token"');
    await queryRunner.query('DELETE FROM "profile"');
    
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

// Clear specific table
export const clearTable = async (tableName: string): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  
  try {
    await queryRunner.query(`DELETE FROM "${tableName}"`);
  } finally {
    await queryRunner.release();
  }
};

// Get entity count
export const getEntityCount = async (entity: any): Promise<number> => {
  const repository = AppDataSource.getRepository(entity);
  return await repository.count();
};

// Wait for async operations
export const waitFor = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock JWT token (for testing auth middleware)
export const mockJwtToken = (payload: any, expiresIn: string = '1h'): string => {
  // In tests, we might want to mock this or use actual JWT
  // For now, return a simple mock
  return `mock-jwt-token-${JSON.stringify(payload)}-${expiresIn}`;
};

// Test authentication helper
export interface TestAuthResponse {
  user: Profile;
  accessToken: string;
  refreshToken: string;
}

// Register and login test user
export const registerAndLoginTestUser = async (
  authService: any, // We'll import this properly in tests
  userData: TestUserData
): Promise<TestAuthResponse> => {
  const registerResult = await authService.register(
    userData.username,
    userData.password,
    userData.displayName
  );
  
  if (!registerResult) {
    throw new Error('Failed to register test user');
  }
  
  return registerResult;
};

// Generate random test data
export const generateRandomUsername = (): string => {
  return `testuser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateRandomContent = (length: number = 50): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Test data factories
export const createTestUserData = (overrides: Partial<TestUserData> = {}): TestUserData => ({
  username: generateRandomUsername(),
  password: 'testpassword123',
  displayName: `Test User ${Math.floor(Math.random() * 1000)}`,
  ...overrides
});

export const createTestPostData = (authorId: number, overrides: Partial<TestPostData> = {}): TestPostData => ({
  content: generateRandomContent(100),
  authorId,
  ...overrides
});

export const createTestCommentData = (authorId: number, postId: number, overrides: Partial<TestCommentData> = {}): TestCommentData => ({
  content: generateRandomContent(50),
  authorId,
  postId,
  ...overrides
});

// Database connection helpers
export const isTestDatabase = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

// Validate test environment
export const validateTestEnvironment = (): void => {
  if (!isTestDatabase()) {
    throw new Error('Tests should only run in test environment');
  }
};