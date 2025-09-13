import { type Profile } from './Profile';

export interface Comment {
  id: number;
  content: string;
  author: Profile;
  post_id?: number;
  created_at: string;
  updated_at: string;
}