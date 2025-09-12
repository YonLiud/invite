import type { Profile } from './Profile';
import type { SuccessResponse } from './Responses';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthData extends AuthTokens {
    user: Profile;
}

export type AuthResponseWithData = SuccessResponse<AuthData>;
export type RefreshResponse = SuccessResponse<AuthTokens>;
export type AuthResponse = SuccessResponse<any>;
