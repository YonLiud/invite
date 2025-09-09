import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { PostService } from "../services/PostService";
import { Post } from "../entities/Post";
import { create } from "domain";

export class PostController extends BaseController {
  private postService: PostService;

  constructor() {
    super();
    this.postService = new PostService();
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { content } = req.body;
      if (!req.user) {
        this.sendUnauthorized(res, "Authentication required");
        return;
      }
      if (!content || typeof content !== "string" || content.trim() === "") {
        this.sendValidationError(res, ["Content is required"]);
        return;
      }

      if (content.length > 1000) {
        this.sendValidationError(res, [
          "Content exceeds maximum length of 1000 characters",
        ]);
        return;
      }

      const post = await this.postService.createPost(req.user, content.trim());

      const postResponse = {
        id: post.id,
        content: post.content,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.display_name,
        },
        createdAt: post.created_at,
      };

      this.sendSuccess(res, postResponse, undefined, 201);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const { page = "1", limit = "20" } = req.query;
      const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
      const limitNum = Math.min(parseInt(limit as string, 10) || 20, 100);

      if (pageNum < 1 || limitNum < 1) {
        return this.sendValidationError(res, [
          "Page and limit must be positive integers",
        ]);
      }

      const result = await this.postService.getAllPosts(pageNum, limitNum);

      const postsResponse = result.posts.map((post) => ({
        id: post.id,
        content: post.content,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.display_name,
        },
        createdAt: post.created_at,
      }));

      this.sendSuccess(res, {
        posts: postsResponse,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalPosts: result.total,
          totalPostsInPage: postsResponse.length,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId) || postId < 1) {
        this.sendValidationError(res, ["Invalid post ID"]);
        return;
      }
      const post = await this.postService.getPostById(postId);
      if (!post) {
        this.sendNotFound(res, "Post not found");
        return;
      }
      const postResponse = {
        id: post.id,
        content: post.content,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.display_name,
        },
        createdAt: post.created_at,
      };
      this.sendSuccess(res, postResponse);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async getPostsByAuthor(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const { limit = "20" } = req.query;
      const limitNum = Math.min(parseInt(limit as string, 10) || 20, 100);
      if (!username || typeof username !== "string") {
        this.sendValidationError(res, ["Username is required"]);
        return;
      }

      const posts = await this.postService.findByAuthorUsername(
        username,
        limitNum,
      );

      const postsResponse = posts.map((post) => ({
        id: post.id,
        content: post.content,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.display_name,
        },
        createdAt: post.created_at,
      }));

      this.sendSuccess(res, postsResponse);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        this.sendUnauthorized(res, "Authentication required");
        return;
      }
      const postId = parseInt(req.params.id, 10);
      const { content } = req.body;
      if (isNaN(postId) || postId < 1) {
        this.sendValidationError(res, ["Invalid post ID"]);
        return;
      }
      if (!content || typeof content !== "string" || content.trim() === "") {
        this.sendValidationError(res, ["Content is required"]);
        return;
      }
      if (content.length > 1000) {
        this.sendValidationError(res, [
          "Content exceeds maximum length of 1000 characters",
        ]);
        return;
      }
      const updatedPost = await this.postService.updatePost(
        postId,
        req.user.id,
        content.trim(),
      );
      if (!updatedPost) {
        this.sendNotFound(res, "Post not found or you are not the author");
        return;
      }
      const postResponse = {
        id: updatedPost.id,
        content: updatedPost.content,
        author: {
          id: updatedPost.author.id,
          username: updatedPost.author.username,
          displayName: updatedPost.author.display_name,
        },
        createdAt: updatedPost.created_at,
      };

      this.sendSuccess(res, postResponse);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        this.sendUnauthorized(res, "Authentication required");
        return;
      }
      const postId = parseInt(req.params.id, 10);
      if (isNaN(postId) || postId < 1) {
        this.sendValidationError(res, ["Invalid post ID"]);
        return;
      }
      const success = await this.postService.deletePost(postId, req.user.id);
      if (!success) {
        this.sendNotFound(res, "Post not found or you are not the author");
        return;
      }
      this.sendSuccess(res, null, "Post deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(res, error.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }
}
