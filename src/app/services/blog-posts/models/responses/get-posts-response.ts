import { Post } from '../post';

export interface GetPostsResponse {
  errorMessage?: string;
  resultData: Post[];
  success: boolean;
}
