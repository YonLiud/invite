import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Profile } from "./Profile";

@Entity()
export class Post extends BaseModel {
    @ManyToOne(() => Profile, (profile) => profile.posts)
    @JoinColumn({ name: "author_id" })
    author!: Profile;

    @Column({ type: "text", nullable: true })
    content?: string;
}
