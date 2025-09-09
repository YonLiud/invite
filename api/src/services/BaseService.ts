import { Repository, ObjectLiteral } from "typeorm";

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as any);
  }

  async create(data: Partial<T>): Promise<T[]> {
    const entity = this.repository.create(data as any);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}