import api from '@/services/api';
import type { Like } from '@/types/Like';

export interface LikePostRequest {
  postId: number;
}

export interface LikesResponse {
  likes: Like[];
  count: number;
}

export class LikeService {
  private static readonly BASE_PATH = '/likes';

  /**
   * Like a post
   */
  static async likePost(postId: number): Promise<Like> {
    const response = await api.post(this.BASE_PATH, { postId });
    return response.data.data;
  }

  /**
   * Unlike a post
   */
  static async unlikePost(postId: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${postId}`);
  }

  /**
   * Get likes for a specific post
   */
  static async getLikesByPost(postId: number): Promise<LikesResponse> {
    const response = await api.get(`${this.BASE_PATH}/post/${postId}`);
    const apiData = response.data.data;
    return {
      likes: apiData.likes || [],
      count: apiData.count || 0
    };
  }

  /**
   * Check if current user has liked a post
   */
  static async hasUserLikedPost(postId: number): Promise<boolean> {
    try {
      const response = await api.get(`${this.BASE_PATH}/check/${postId}`);
      return response.data.data.liked || false;
    } catch (error) {
      return false;
    }
  }
}