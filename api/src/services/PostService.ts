import { BaseService } from "./BaseService";
import { Post } from "../entities/Post";
import { AppDataSource } from "../data-source";
import { Profile } from "../entities/Profile";

export class PostService extends BaseService<Post> {
  constructor() {
    super(AppDataSource.getRepository(Post));
  }

  async createPost(authorId: number, content: string): Promise<Post> {
    return this.createOne({
      author: { id: authorId } as Profile,
      content
    });
  }

  async getPostsByAuthorId(authorId: number, limit: number = 20): Promise<Post[]> {
    return this.repository.find({
      where: { author: { id: authorId } },
      order: { created_at: "DESC" },
      take: limit,
      relations: ["author"]
    });
  }

  async findByAuthorUsername(
    username: string,
    limit?: number,
  ): Promise<Post[]> {
    const query = this.repository.createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .where("author.username = :username", { username })
      .orderBy("post.created_at", "DESC");
    
    if (limit) {
      query.take(limit);
    }
    
    return query.getMany();
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
    return this.repository.findOne({
      where: { id: postId },
      relations: ["author"]
    });
  }

  async updatePost(
    postId: number,
    authorId: number,
    content: string,
  ): Promise<Post | null> {
    const post = await this.repository.findOne({
      where: { id: postId },
      relations: ["author"]
    });
    
    if (!post || post.author.id !== authorId) {
      return null;
    }
    return this.update(postId, { content });
  }

  async deletePost(postId: number, authorId: number): Promise<boolean> {
    const post = await this.repository.findOne({
      where: { id: postId },
      relations: ["author"]
    });
    
    if (!post || post.author.id !== authorId) {
      return false;
    }
    return this.delete(postId);
  }
}