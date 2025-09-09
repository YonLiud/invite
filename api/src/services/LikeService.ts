import { BaseService } from "./BaseService";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";
import { Profile } from "../entities/Profile";
import { Post } from "../entities/Post";

export class LikeService extends BaseService<Like> {
  constructor() {
    super(AppDataSource.getRepository(Like));
  }

  async likePost(authorId: number, postId: number): Promise<Like | null> {
    const existingLike = await this.repository.findOne({
      where: {
        author: { id: authorId },
        post: { id: postId },
      },
    });

    if (existingLike) {
      return existingLike;
    }

    return this.createOne({
      author: { id: authorId } as Profile,
      post: { id: postId } as Post,
    });
  }

  async unlikePost(authorId: number, postId: number): Promise<boolean> {
    const result = await this.repository.delete({
      author: { id: authorId },
      post: { id: postId },
    });

    return result.affected !== 0;
  }

  async getLikesByPost(postId: number, limit: number = 50): Promise<Like[]> {
    return this.repository.find({
      where: { post: { id: postId } },
      order: { created_at: "DESC" },
      take: limit,
      relations: ["author"],
    });
  }

  async getLikesByUser(userId: number, limit: number = 50): Promise<Like[]> {
    return this.repository.find({
      where: { author: { id: userId } },
      order: { created_at: "DESC" },
      take: limit,
      relations: ["post", "post.author"],
    });
  }

  async getLikeByUserAndPost(
    authorId: number,
    postId: number,
  ): Promise<Like | null> {
    return this.repository.findOne({
      where: {
        author: { id: authorId },
        post: { id: postId },
      },
      relations: ["author", "post"],
    });
  }

  async getLikesCountForPost(postId: number): Promise<number> {
    return this.repository.count({
      where: { post: { id: postId } },
    });
  }

  async hasUserLikedPost(authorId: number, postId: number): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        author: { id: authorId },
        post: { id: postId },
      },
    });
    return count > 0;
  }
}
