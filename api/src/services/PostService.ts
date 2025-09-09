import { BaseService } from "./BaseService";
import { Post } from "../entities/Post";
import { AppDataSource } from "../data-source";
import { Profile } from "../entities/Profile";

export class PostService extends BaseService<Post> {
  constructor() {
    super(AppDataSource.getRepository(Post));
  }

  async createPost(author: Profile, content: string): Promise<Post> {
    return this.createOne({
      author,
      content,
      created_at: new Date(),
    });
  }

  async findByAuthor(authorId: number, limit?: number): Promise<Post[]> {
    if (limit) {
      return this.repository.find({
        where: { author: { id: authorId } },
        take: limit,
        order: { created_at: "DESC" },
      });
    }
    return this.repository.find({
      where: { author: { id: authorId } },
      order: { created_at: "DESC" },
    });
  }

  async findByAuthorUsername(
    username: string,
    limit?: number,
  ): Promise<Post[]> {
    if (limit) {
      return this.repository.find({
        where: { author: { username } },
        take: limit,
        order: { created_at: "DESC" },
      });
    }
    return this.repository.find({
      where: { author: { username } },
      order: { created_at: "DESC" },
    });
  }

  async getAllPosts(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [posts, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { created_at: "DESC" },
      relations: ["author"],
    });
    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getPostById(postId: number): Promise<Post | null> {
    return this.findById(postId);
  }

  async updatePost(
    postId: number,
    authorId: number,
    content: string,
  ): Promise<Post | null> {
    const post = await this.findById(postId);
    if (!post || post.author.id !== authorId) {
      return null;
    }
    return this.update(postId, { content });
  }

  async deletePost(postId: number, authorId: number): Promise<boolean> {
    const post = await this.findById(postId);
    if (!post || post.author.id !== authorId) {
      return false;
    }
    return this.delete(postId);
  }
}
