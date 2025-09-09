import "reflect-metadata";
import { DataSource } from "typeorm";
import { Profile } from "./entities/Profile";
import { Post } from "./entities/Post";
import { Like } from "./entities/Like";
import { Comment } from "./entities/Comment";
import { RefreshToken } from "./entities/RefreshToken";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "inviteadmin",        // or your username
  password: "secret",       // or your password
  database: "invitedb",     // or your db name
  synchronize: true,        // auto-create tables (ONLY for dev!)
  logging: false,
  entities: [Profile, Post, Like, Comment, RefreshToken],
  migrations: [],
  subscribers: [],
});
