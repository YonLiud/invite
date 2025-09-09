import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { CommentService } from '../services/CommentService';

export class CommentController extends BaseController {
    private commentService: CommentService;

    constructor() {
        super();
        this.commentService = new CommentService();
    }

    async createComment(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                return this.sendUnauthorized(res, 'Authentication required');
            }

            const { postId, content } = req.body;
            
            if (!postId) {
                return this.sendValidationError(res, ['Post ID is required']);
            }
            
            const postIdNum = parseInt(postId, 10);
            if (isNaN(postIdNum)) {
                return this.sendValidationError(res, ['Invalid Post ID']);
            }

            if (!content || content.trim().length === 0) {
                return this.sendValidationError(res, ['Content is required']);
            }

            const trimmedContent = content.trim();
            if (trimmedContent.length > 300) {
                return this.sendValidationError(res, ['Content must be less than 300 characters']);
            }

            const comment = await this.commentService.createComment(req.user.id, postIdNum, trimmedContent);
            
            if (!comment) {
                return this.sendError(res, 'Failed to create comment. Ensure post exists.', 500);
            }

            const commentResponse = {
                id: comment.id,
                content: comment.content,
                created_at: comment.created_at,
                author: {
                    id: req.user.id,
                    username: req.user.username,
                    display_name: req.user.display_name
                },
                post_id: comment.post.id
            };
            
            this.sendSuccess(res, commentResponse, 'Comment created successfully', 201);
        } catch (error) {
            console.error("Error creating comment:", error);
            this.sendError(res, 'Internal server error', 500);
        }
    }

    async getCommentsByPost(req: Request, res: Response): Promise<void> {
        try {
        const postId = parseInt(req.params.postId, 10);
        const { page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = Math.min(parseInt(limit as string, 10) || 20, 100);

        if (isNaN(postId) || pageNum < 1 || limitNum < 1) {
            return this.sendValidationError(res, ['Invalid post ID, page, or limit']);
        }

        const result = await this.commentService.getCommentsWithPagination(postId, pageNum, limitNum);
        
        const commentsResponse = result.items.map(comment => ({
            id: comment.id,
            content: comment.content,
            author: {
                id: comment.author.id,
                username: comment.author.username,
                display_name: comment.author.display_name
            },
            created_at: comment.created_at,
            updated_at: comment.updated_at
        }));

        this.sendSuccess(res, {
            comments: commentsResponse,
            pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalItems: result.total,
            itemsPerPage: limitNum
            }
        });
        } catch (err: unknown) {
        if (err instanceof Error) {
            this.sendError(res, err.message, 500);
        } else {
            this.sendError(res, 'Unknown error occurred', 500);
        }
        }
    }
    async getComment(req: Request, res: Response): Promise<void> {
        try {
        const commentId = parseInt(req.params.id, 10);
        
        if (isNaN(commentId)) {
            return this.sendValidationError(res, ['Invalid comment ID']);
        }

        const comment = await this.commentService.getCommentById(commentId);
        
        if (!comment) {
            return this.sendNotFound(res, 'Comment not found');
        }

        const commentResponse = {
            id: comment.id,
            content: comment.content,
            author: {
            id: comment.author.id,
            username: comment.author.username,
            display_name: comment.author.display_name
            },
            post_id: comment.post.id,
            created_at: comment.created_at,
            updated_at: comment.updated_at
        };

        this.sendSuccess(res, commentResponse);
        } catch (err: unknown) {
        if (err instanceof Error) {
            this.sendError(res, err.message, 500);
        } else {
            this.sendError(res, 'Unknown error occurred', 500);
        }
        }
    }

    async updateComment(req: Request, res: Response): Promise<void> {
        try {
        if (!req.user) {
            return this.sendUnauthorized(res, 'Authentication required');
        }

        const commentId = parseInt(req.params.id, 10);
        const { content } = req.body;
        
        if (isNaN(commentId)) {
            return this.sendValidationError(res, ['Invalid comment ID']);
        }

        if (!content || content.trim().length === 0) {
            return this.sendValidationError(res, ['Content is required']);
        }

        if (content.length > 500) {
            return this.sendValidationError(res, ['Content must be less than 500 characters']);
        }

        const updatedComment = await this.commentService.updateComment(commentId, req.user.id, content.trim());
        
        if (!updatedComment) {
            return this.sendNotFound(res, 'Comment not found or you do not have permission to edit it');
        }

        const commentResponse = {
            id: updatedComment.id,
            content: updatedComment.content,
            author: {
            id: req.user.id,
            username: req.user.username,
            display_name: req.user.display_name
            },
            post_id: updatedComment.post.id,
            created_at: updatedComment.created_at,
            updated_at: updatedComment.updated_at
        };

        this.sendSuccess(res, commentResponse, 'Comment updated successfully');
        } catch (err: unknown) {
        if (err instanceof Error) {
            this.sendError(res, err.message, 500);
        } else {
            this.sendError(res, 'Unknown error occurred', 500);
        }
        }
    }

    async deleteComment(req: Request, res: Response): Promise<void> {
        try {
        if (!req.user) {
            return this.sendUnauthorized(res, 'Authentication required');
        }

        const commentId = parseInt(req.params.id, 10);
        
        if (isNaN(commentId)) {
            return this.sendValidationError(res, ['Invalid comment ID']);
        }

        const result = await this.commentService.deleteComment(commentId, req.user.id);
        
        if (!result) {
            return this.sendNotFound(res, 'Comment not found or you do not have permission to delete it');
        }

        this.sendSuccess(res, null, 'Comment deleted successfully');
        } catch (err: unknown) {
        if (err instanceof Error) {
            this.sendError(res, err.message, 500);
        } else {
            this.sendError(res, 'Unknown error occurred', 500);
        }
        }
    }
}