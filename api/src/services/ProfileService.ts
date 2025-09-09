import { BaseService } from "./BaseService";
import { Profile } from "../entities/Profile";
import { AppDataSource } from "../data-source";
import { comparePassword, hashPassword } from "../utils/password";

export class ProfileService extends BaseService<Profile> {
    constructor() {
        super(AppDataSource.getRepository(Profile));
    }

    async findByUsername(username: string): Promise<Profile | null> {
        return this.repository.findOneBy({ username });
    }

    async createProfile(
        username: string,
        password: string,
        displayName?: string,
    ): Promise<Profile> {
        const password_hash = await hashPassword(password);
        return this.createOne({
            username,
            password_hash,
            display_name: displayName,
        });
    }

    async updateProfile(
        profileId: number,
        updates: {
            display_name?: string;
            current_password?: string;
            new_password?: string;
        },
    ): Promise<Profile | null> {
        const profile = await this.findById(profileId);
        if (!profile) {
            return null;
        }

        if (updates.new_password) {
            if (!updates.current_password) {
                throw new Error(
                    "Current password is required to change password",
                );
            }

            const isValid = await comparePassword(
                updates.current_password,
                profile.password_hash,
            );
            if (!isValid) {
                throw new Error("Current password is incorrect");
            }

            const updateData: Partial<Profile> = {
                display_name: updates.display_name,
            };

            const newPasswordHash = await hashPassword(updates.new_password);
            updateData["password_hash"] = newPasswordHash;

            return this.update(profileId, updateData);
        }

        const updateData: Partial<Profile> = {
            display_name: updates.display_name,
        };

        return this.update(profileId, updateData);
    }

    async deleteProfile(profileId: number): Promise<boolean> {
        return this.delete(profileId);
    }

    async searchProfiles(
        query: string,
        limit: number = 20,
    ): Promise<Profile[]> {
        return this.repository
            .createQueryBuilder("profile")
            .where(
                "profile.username ILIKE :query OR profile.display_name ILIKE :query",
                {
                    query: `%${query}%`,
                },
            )
            .limit(limit)
            .getMany();
    }
}
