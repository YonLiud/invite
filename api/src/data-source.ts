import "reflect-metadata";
import { DataSource } from "typeorm";
import { Profile } from "./entities/Profile";
import { Post } from "./entities/Post";
import { Like } from "./entities/Like";
import { Comment } from "./entities/Comment";
import { RefreshToken } from "./entities/RefreshToken";

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "inviteadmin",
  password: process.env.DB_PASSWORD || "secret",
  database: process.env.DB_NAME || "invitedb",
  synchronize: true,
  logging: true,
  entities: [Profile, Post, Like, Comment, RefreshToken],
  migrations: [],
  subscribers: [],
});
