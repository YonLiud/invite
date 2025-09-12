import { type Profile } from './Profile';

export interface Like {
  id: number;
  author: Profile;
  post_id: number;
  created_at: string;
}