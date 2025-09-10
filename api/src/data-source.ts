import "reflect-metadata";
import { DataSource } from "typeorm";
import { Profile } from "./entities/Profile";
import { Post } from "./entities/Post";
import { Like } from "./entities/Like";
import { Comment } from "./entities/Comment";
import { RefreshToken } from "./entities/RefreshToken";

const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || (isTest ? "5433" : "5432"), 10),
  username: process.env.DB_USERNAME || "inviteadmin",
  password: process.env.DB_PASSWORD || "secret",
  database: process.env.DB_NAME || (isTest ? "invitedb_test" : "invitedb"),
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [Profile, Post, Like, Comment, RefreshToken],
  migrations: [],
  subscribers: [],
});