import { Category } from '../category';

export interface GetCategoriesResponse {
  errorMessage?: string;
  resultData: Category[];
  success: boolean;
}
