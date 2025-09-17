import api from '@/services/api';
import type { Comment } from '@/types/Comment';

export interface CreateCommentRequest {
  postId: number;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    totalCommentsInPage: number;
  };
}

export class CommentService {
  private static readonly BASE_PATH = '/comments';

  /**
   * Get comments for a specific post with pagination
   */
  static async getCommentsByPost(
    postId: number, 
    page: number = 1, 
    limit: number = 10
  ): Promise<CommentsResponse> {
    const response = await api.get(`${this.BASE_PATH}/post/${postId}`, {
      params: { page, limit }
    });
    
    // Extract the nested data and map pagination field names
    const apiData = response.data.data;
    return {
      comments: apiData.comments,
      pagination: {
        currentPage: apiData.pagination.currentPage,
        totalPages: apiData.pagination.totalPages,
        totalComments: apiData.pagination.totalItems,
        totalCommentsInPage: apiData.comments.length
      }
    };
  }

  /**
   * Create a new comment
   */
  static async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await api.post(this.BASE_PATH, data);
    return response.data.data;
  }

  /**
   * Get a specific comment by ID
   */
  static async getCommentById(id: number): Promise<Comment> {
    const response = await api.get(`${this.BASE_PATH}/${id}`);
    return response.data.data;
  }

  /**
   * Update a comment
   */
  static async updateComment(id: number, data: UpdateCommentRequest): Promise<Comment> {
    const response = await api.put(`${this.BASE_PATH}/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete a comment
   */
  static async deleteComment(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Get comments by author
   */
  static async getCommentsByAuthor(
    authorId: number, 
    page: number = 1, 
    limit: number = 10
  ): Promise<CommentsResponse> {
    const response = await api.get(`${this.BASE_PATH}/author/${authorId}`, {
      params: { page, limit }
    });
    
    const apiData = response.data.data;
    return {
      comments: apiData.comments,
      pagination: {
        currentPage: apiData.pagination.currentPage,
        totalPages: apiData.pagination.totalPages,
        totalComments: apiData.pagination.totalItems,
        totalCommentsInPage: apiData.comments.length
      }
    };
  }

  /**
   * Search comments
   */
  static async searchComments(
    query: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<CommentsResponse> {
    const response = await api.get(`${this.BASE_PATH}/search`, {
      params: { q: query, page, limit }
    });
    
    const apiData = response.data.data;
    return {
      comments: apiData.comments,
      pagination: {
        currentPage: apiData.pagination.currentPage,
        totalPages: apiData.pagination.totalPages,
        totalComments: apiData.pagination.totalItems,
        totalCommentsInPage: apiData.comments.length
      }
    };
  }
}