import bcrypt from "bcryptjs";

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, Number(SALT_ROUNDS));
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
