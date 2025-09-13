import api from '@/services/api';
import type { Post } from '@/types/Post';

export interface CreatePostRequest {
  content: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    totalPostsInPage: number;
  };
}

export class PostService {
  private static readonly BASE_PATH = '/posts';

  /**
   * Create a new post
   */
  static async createPost(data: CreatePostRequest): Promise<Post> {
    const response = await api.post<{ data: Post }>(this.BASE_PATH, data);
    return response.data.data;
  }

  /**
   * Get all posts with pagination
   */
  static async getPosts(page: number = 1, limit: number = 20): Promise<PostsResponse> {
    const response = await api.get<{ data: PostsResponse }>(this.BASE_PATH, {
      params: { page, limit }
    });
    return response.data.data;
  }

  /**
   * Get a specific post by ID
   */
  static async getPostById(id: number): Promise<Post> {
    const response = await api.get<{ data: Post }>(`${this.BASE_PATH}/${id}`);
    return response.data.data;
  }

  /**
   * Update a post
   */
  static async updatePost(id: number, data: CreatePostRequest): Promise<Post> {
    const response = await api.put<{ data: Post }>(`${this.BASE_PATH}/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete a post
   */
  static async deletePost(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Get posts by a specific user
   */
  static async getPostsByUser(userId: number, page: number = 1, limit: number = 20): Promise<PostsResponse> {
    const response = await api.get<{ data: PostsResponse }>(`/users/${userId}/posts`, {
      params: { page, limit }
    });
    return response.data.data;
  }
}