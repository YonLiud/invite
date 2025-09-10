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

let usernameCounter = 0;
export const generateUniqueUsername = (): string => {
  usernameCounter++;
  return `testuser_${Date.now()}_${usernameCounter}_${Math.random().toString(36).substr(2, 5)}`;
};

// Create a single test user
export const createTestUser = async (userData: TestUserData): Promise<Profile> => {
  const profileRepository = AppDataSource.getRepository(Profile);
  const password_hash = await hashPassword(userData.password);
  
  // Always generate unique username
  const username = userData.username.includes('testuser_') 
    ? userData.username 
    : generateUniqueUsername();
  
  const profile = profileRepository.create({
    username: username,
    password_hash,
    display_name: userData.displayName
  });
  
  return await profileRepository.save(profile);
};

// Create a test post with proper relations
export const createTestPost = async (postData: TestPostData): Promise<Post> => {
  const postRepository = AppDataSource.getRepository(Post);
  
  const post = postRepository.create({
    content: postData.content,
    author: { id: postData.authorId } as Profile
  });
  
  const savedPost = await postRepository.save(post);
  
  // Reload with relations
  return await postRepository.findOne({
    where: { id: savedPost.id },
    relations: ["author"]
  }) as Post;
};

// Clear all test data properly
export const clearTestDatabase = async (): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Clear in CORRECT order - children first, parents last
    // 1. Comments (depends on posts and profiles)
    await queryRunner.query('DELETE FROM "comment"');
    
    // 2. Likes (depends on posts and profiles)  
    await queryRunner.query('DELETE FROM "like"');
    
    // 3. Refresh tokens (depends on profiles)
    await queryRunner.query('DELETE FROM "refresh_token"');
    
    // 4. Posts (depends on profiles)
    await queryRunner.query('DELETE FROM "post"');
    
    // 5. Profiles (no dependencies)
    await queryRunner.query('DELETE FROM "profile"');
    
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Database cleanup failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
};

