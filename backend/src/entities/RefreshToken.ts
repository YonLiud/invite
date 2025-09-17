import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Profile } from "./Profile";

@Entity()
export class RefreshToken extends BaseModel {
  @ManyToOne(() => Profile)
  @JoinColumn({ name: "user_id" })
  user!: Profile;

  @Column({ length: 255, nullable: false })
  token_hash!: string;

  @Column({ type: "timestamp with time zone", nullable: false })
  expires_at!: Date;

  @Column({ type: "boolean", default: false })
  revoked!: boolean;
}
