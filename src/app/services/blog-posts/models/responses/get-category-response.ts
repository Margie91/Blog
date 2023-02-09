import { Category } from '../category';

export interface GetCategoryResponse {
  errorMessage?: string;
  resultData: Category;
  success: boolean;
}
