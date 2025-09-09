import { BaseService } from "./BaseService";
import { Post } from "../entities/Post";
import { AppDataSource } from "../data-source";

export class PostService extends BaseService<Post> {
  constructor() {
    super(AppDataSource.getRepository(Post));
  }

  async findByAuthorId(authorId: number): Promise<Post[]> {
    return this.repository.find({
      where: { author: { id: authorId } },
      relations: ["author"],
    });
  }
}