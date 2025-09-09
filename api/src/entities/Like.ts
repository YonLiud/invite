import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Profile } from "./Profile";
import { Post } from "./Post";

@Entity()
@Unique(["author", "post"]) // Enforce unique like per user/post
export class Like extends BaseModel {
    @ManyToOne(() => Profile)
    @JoinColumn({ name: "author_id" })
    author!: Profile;

    @ManyToOne(() => Post)
    @JoinColumn({ name: "post_id" })
    post!: Post;
}
