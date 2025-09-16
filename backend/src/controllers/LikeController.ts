import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { LikeService } from "../services/LikeService";
import { DiffieHellmanGroup } from "crypto";

export class LikeController extends BaseController {
  private likeService: LikeService;

  constructor() {
    super();
    this.likeService = new LikeService();
  }

  async likePost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return this.sendUnauthorized(res, "Authentication required");
      }

      const { postId } = req.body;

      if (!postId) {
        return this.sendValidationError(res, ["Post ID is required"]);
      }

      const postIdNum = parseInt(postId, 10);
      if (isNaN(postIdNum)) {
        return this.sendValidationError(res, ["Invalid Post ID"]);
      }

      const like = await this.likeService.likePost(req.user.id, postIdNum);

      if (!like) {
        return this.sendError(
          res,
          "Failed to like post. Ensure post exists.",
          500,
        );
      }

      const likeResponse = {
        id: like.id,
        author: {
          id: req.user.id,
          username: req.user.username,
          display_name: req.user.display_name,
        },
        post_id: like.post.id,
        created_at: like.created_at,
      };

      this.sendSuccess(res, likeResponse, "Post liked successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.sendError(res, err.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async unlikePost(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return this.sendUnauthorized(res, "Authentication required");
      }

      const postId = parseInt(req.params.postId, 10);

      if (isNaN(postId)) {
        return this.sendValidationError(res, ["Invalid Post ID"]);
      }

      const result = await this.likeService.unlikePost(req.user.id, postId);

      if (!result) {
        return this.sendNotFound(
          res,
          "Like not found or you have not liked this post",
        );
      }

      this.sendSuccess(res, null, "Post unliked successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.sendError(res, err.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async getLikesByPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = parseInt(req.params.postId, 10);
      const { limit = "50" } = req.query;
      const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);

      if (isNaN(postId)) {
        return this.sendValidationError(res, ["Invalid Post ID"]);
      }

      const likes = await this.likeService.getLikesByPost(postId, limitNum);

      const likesResponse = likes.map((like) => ({
        id: like.id,
        author: {
          id: like.author.id,
          username: like.author.username,
          display_name: like.author.display_name,
        },
        created_at: like.created_at,
      }));

      const likesCount = await this.likeService.getLikesCountForPost(postId);

      this.sendSuccess(res, {
        likes: likesResponse,
        count: likesCount,
        post_id: postId,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.sendError(res, err.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async getMyLikes(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return this.sendUnauthorized(res, "Authentication required");
      }

      const { limit = "50" } = req.query;
      const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);

      const likes = await this.likeService.getLikesByUser(
        req.user.id,
        limitNum,
      );

      const likesResponse = likes.map((like) => ({
        id: like.id,
        post: {
          id: like.post.id,
          content: like.post.content,
          author: {
            id: like.post.author.id,
            username: like.post.author.username,
            display_name: like.post.author.display_name,
          },
          created_at: like.post.created_at,
        },
        created_at: like.created_at,
      }));

      this.sendSuccess(res, {
        likes: likesResponse,
        count: likes.length,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.sendError(res, err.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }

  async checkIfLiked(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return this.sendUnauthorized(res, "Authentication required");
      }

      const postId = parseInt(req.params.postId, 10);

      if (isNaN(postId)) {
        return this.sendValidationError(res, ["Invalid Post ID"]);
      }

      const isLiked = await this.likeService.hasUserLikedPost(
        req.user.id,
        postId,
      );

      this.sendSuccess(res, {
        liked: isLiked,
        post_id: postId,
        user_id: req.user.id,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.sendError(res, err.message, 500);
      } else {
        this.sendError(res, "Unknown error occurred", 500);
      }
    }
  }
}
