import { Repository, ObjectLiteral } from "typeorm";
import logger from "../utils/logger";

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(limit?: number): Promise<T[]> {
    if (limit) return this.repository.find({ take: limit });
    return this.repository.find();
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as any);
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as any);
    const saved = await this.repository.save(entity);
    logger.debug("Created entity:", saved);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async createOne(data: Partial<T>): Promise<T> {
    return this.create(data);
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data as any);
    return this.repository.save(entities);
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    logger.debug(`Updated entity with id ${id}:`, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    logger.debug(`Deleted entity with id ${id}:`, result);
    return result.affected !== 0;
  }
}
