import { BaseService } from "./BaseService";
import { Comment } from "../entities/Comment";
import { AppDataSource } from "../data-source";
import { Profile } from "../entities/Profile";
import { Post } from "../entities/Post";

export class CommentService extends BaseService<Comment> {
  constructor() {
    super(AppDataSource.getRepository(Comment));
  }

  async createComment(
    authorId: number,
    postId: number,
    content: string,
  ): Promise<Comment | null> {
    if (!content || content.trim() === "") {
      return null;
    }
    if (content.length > 300) {
      return null;
    }
    const author = await AppDataSource.getRepository(Profile).findOneBy({
      id: authorId,
    });
    const post = await AppDataSource.getRepository(Post).findOneBy({
      id: postId,
    });

    if (!author || !post) {
      return null;
    }
    const createdComment = await this.createOne({
      author,
      post,
      content: content.trim(),
    });
    const commentWithRelations = await this.repository.findOne({
      where: { id: createdComment.id },
      relations: ["author", "post"],
    });

    if (!commentWithRelations) {
      throw new Error("Failed to retrieve created comment with relations");
    }

    return commentWithRelations;
  }

  async getCommentsByPost(
    postId: number,
    limit: number = 20,
  ): Promise<Comment[]> {
    return this.repository.find({
      where: { post: { id: postId } },
      order: { created_at: "ASC" },
      take: limit,
      relations: ["author"],
    });
  }

  async getCommentsByAuthor(
    authorId: number,
    limit: number = 20,
  ): Promise<Comment[]> {
    return this.repository.find({
      where: { author: { id: authorId } },
      relations: ["post"],
      order: { created_at: "DESC" },
      take: limit,
    });
  }

  async getCommentById(id: number): Promise<Comment | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["author", "post"],
    });
  }

  async updateComment(
    id: number,
    authorId: number,
    content: string,
  ): Promise<Comment | null> {
    const comment = await this.getCommentById(id);
    if (!comment || comment.author.id !== authorId) {
      return null;
    }
    if (!content || content.trim() === "" || content.length > 300) {
      return null;
    }
    await this.update(id, { content: content.trim() });
    const updatedCommentWithRelations = await this.repository.findOne({
      where: { id: id },
      relations: ["author", "post"],
    });

    return updatedCommentWithRelations;
  }

  async deleteComment(id: number, authorId: number): Promise<boolean> {
    const comment = await this.getCommentById(id);

    if (!comment || comment.author.id !== authorId) {
      return false;
    }
    return this.delete(id);
  }

  async getCommentsWithPagination(
    postId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    items: Comment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await this.repository.findAndCount({
      where: { post: { id: postId } },
      order: { created_at: "ASC" },
      skip,
      take: limit,
      relations: ["author"],
    });

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
