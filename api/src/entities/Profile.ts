import { Entity, Column, OneToMany, Unique } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Post } from "./Post";

@Entity()
@Unique(["username"])
export class Profile extends BaseModel {
  @Column({ length: 255, nullable: false })
  username!: string;

  @Column({ length: 255, nullable: false })
  password_hash!: string;

  @Column({ length: 255, nullable: true })
  display_name?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}
