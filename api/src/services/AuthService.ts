import { Profile } from "../entities/Profile";
import { ProfileService } from "./ProfileService";
import { hashPassword, comparePassword } from "../utils/password";
import {
    generateAccessToken,
    generateRefreshToken,
    JwtPayload,
    verifyToken,
} from "../utils/jwt";
import { RefreshToken } from "../entities/RefreshToken";
import { AppDataSource } from "../data-source";

export class AuthService {
    private profileService: ProfileService;
    private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    private REFRESH_TOKEN_EXPIRES_DAYS =
        Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

    constructor() {
        this.profileService = new ProfileService();
    }

    async register(
        username: string,
        password: string,
        displayName: string,
    ): Promise<{
        user: Profile;
        accessToken: string;
        refreshToken: string;
    } | null> {
        const existingUser = await this.profileService.findByUsername(username);
        if (existingUser) {
            return null;
        }

        const password_hash = await hashPassword(password);

        const profile = await this.profileService.createOne({
            username: username,
            password_hash: password_hash,
            display_name: displayName,
        });

        const payload: JwtPayload = {
            profileId: profile.id,
            username: profile.username,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const hashedToken = await hashPassword(refreshToken);

        const refreshTokenEntity = this.refreshTokenRepository.create({
            user: profile,
            token_hash: hashedToken,
            expires_at: new Date(
                Date.now() +
                    this.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
            ),
        });

        await this.refreshTokenRepository.save(refreshTokenEntity);
        return { user: profile, accessToken, refreshToken };
    }

    async login(
        username: string,
        password: string,
    ): Promise<{
        user: Profile;
        accessToken: string;
        refreshToken: string;
    } | null> {
        const profile = await this.profileService.findByUsername(username);
        if (!profile) {
            return null;
        }

        const isValidPassword = await comparePassword(
            password,
            profile.password_hash,
        );
        if (!isValidPassword) {
            return null;
        }
        const payload: JwtPayload = {
            profileId: profile.id,
            username: profile.username,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const hashedToken = await hashPassword(refreshToken);
        const refreshTokenEntity = this.refreshTokenRepository.create({
            user: profile,
            token_hash: hashedToken,
            expires_at: new Date(
                Date.now() +
                    this.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
            ),
        });

        await this.refreshTokenRepository.save(refreshTokenEntity);
        return { user: profile, accessToken, refreshToken };
    }

    async refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    } | null> {
        const payload = verifyToken(refreshToken);
        if (!payload) {
            return null;
        }

        const refreshTokenEntity = await this.refreshTokenRepository.findOne({
            where: { user: { id: payload.profileId } },
            order: { expires_at: "DESC" },
        });

        if (!refreshTokenEntity) {
            return null;
        }
        if (refreshTokenEntity.revoked) return null;
        if (refreshTokenEntity.expires_at < new Date()) return null;

        const isValid = await comparePassword(
            refreshToken,
            refreshTokenEntity.token_hash,
        );
        if (!isValid) {
            refreshTokenEntity.revoked = true; //? Removed for enhanced security
            await this.refreshTokenRepository.save(refreshTokenEntity);
            return null;
        }

        const newPayload: JwtPayload = {
            profileId: payload.profileId,
            username: payload.username,
        };

        const newAccessToken = generateAccessToken(newPayload);
        const newRefreshToken = generateRefreshToken(newPayload);

        const hashedNewToken = await hashPassword(newRefreshToken);
        refreshTokenEntity.token_hash = hashedNewToken;
        refreshTokenEntity.expires_at = new Date(
            Date.now() + this.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
        );
        refreshTokenEntity.revoked = false;
        await this.refreshTokenRepository.save(refreshTokenEntity);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(refreshToken: string): Promise<boolean> {
        const payload = verifyToken(refreshToken);
        if (!payload) {
            return false;
        }

        const refreshTokenEntity = await this.refreshTokenRepository.findOne({
            where: { user: { id: payload.profileId } },
            order: { expires_at: "DESC" },
        });
        if (!refreshTokenEntity) {
            return false;
        }

        const isValid = await comparePassword(
            refreshToken,
            refreshTokenEntity.token_hash,
        );
        if (!isValid) {
            return false;
        }

        refreshTokenEntity.revoked = true;
        await this.refreshTokenRepository.save(refreshTokenEntity);
        return true;
    }

    async logoutAllSessions(userId: number): Promise<void> {
        await this.refreshTokenRepository.update(
            { user: { id: userId } },
            { revoked: true },
        );
    }
}
