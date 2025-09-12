import { type Profile } from './Profile';

export interface Post {
  id: number;
  content: string;
  author: Profile;
  created_at: string;
  updated_at: string;
}