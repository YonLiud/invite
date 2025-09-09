import { Profile } from "../entities/Profile";
import { ProfileService } from "./ProfileService";
import { hashPassword, comparePassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken, JwtPayload } from "../utils/jwt";
import { RefreshToken } from "../entities/RefreshToken";
import { AppDataSource } from "../data-source";

export class AuthService {
    private profileService: ProfileService;
    private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    private REFRESH_TOKEN_EXPIRES_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

    constructor() {
        this.profileService = new ProfileService();
    }

    async register(username: string, password: string, displayName: string): Promise<{
        user: Profile,
        accessToken: string,
        refreshToken: string
    } | null> {
        const existingUser = await this.profileService.findByUsername(username);
        if (existingUser) {
            return null;
        }

        const password_hash = await hashPassword(password);
        
        // ✅ Use createOne to ensure single entity return
        const profile = await this.profileService.createOne({
            username: username,
            password_hash: password_hash,
            display_name: displayName
        });

        const payload: JwtPayload = { 
            profileId: profile.id, 
            username: profile.username 
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const hashedToken = await hashPassword(refreshToken);

        const refreshTokenEntity = this.refreshTokenRepository.create({
            user: profile,
            token_hash: hashedToken,
            expires_at: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000)
        });

        await this.refreshTokenRepository.save(refreshTokenEntity);
        return { user: profile, accessToken, refreshToken };
    }
}