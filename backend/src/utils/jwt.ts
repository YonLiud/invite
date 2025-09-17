import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "verylongandsecuresecretkeythatnobodyshouldknow";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export interface JwtPayload {
  profileId: number;
  username: string;
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
