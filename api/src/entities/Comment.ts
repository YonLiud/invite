import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Profile } from "./Profile";
import { Post } from "./Post";

@Entity()
export class Comment extends BaseModel {
    @ManyToOne(() => Profile)
    @JoinColumn({ name: "author_id" })
    author!: Profile;

    @ManyToOne(() => Post)
    @JoinColumn({ name: "post_id" })
    post!: Post;

    @Column({ type: "text", nullable: true })
    content?: string;
}
