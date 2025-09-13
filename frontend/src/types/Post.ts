import { type Profile } from './Profile';

export interface Post {
  id: number;
  content: string;
  author: Profile;
  createdAt: string;
  updatedAt: string;
}