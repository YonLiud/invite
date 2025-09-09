import { BaseService } from "./BaseService";
import { Profile } from "../entities/Profile";
import { AppDataSource } from "../data-source";

export class ProfileService extends BaseService<Profile> {
  constructor() {
    super(AppDataSource.getRepository(Profile));
  }

  async createProfile(data: Partial<Profile>): Promise<Profile[]> {
    return this.create(data);
  }

  async findByUsername(username: string): Promise<Profile | null> {
    return this.repository.findOneBy({ username });
  }
}