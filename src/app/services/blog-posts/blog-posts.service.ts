import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../base-url';
import { ServiceSuffix } from '../service-suffix';
import { Category } from './models/category';
import { Post } from './models/post';
import { AddCategoryRequest } from './models/requests/add-category-request';
import { AddPostRequest } from './models/requests/add-post-request';
import {
  PatchPostRequest,
  PatchPostRequestPath,
} from './models/requests/patch-post-request';
import { GetCategoriesResponse } from './models/responses/get-categories-response';
import { GetCategoryResponse } from './models/responses/get-category-response';
import { GetPostsResponse } from './models/responses/get-posts-response';

@Injectable({
  providedIn: 'root',
})
export class BlogPostsService {
  constructor(private http: HttpClient) {}

  public getPosts(): Observable<GetPostsResponse> {
    return this.http.get<GetPostsResponse>(
      `${baseUrl}/${ServiceSuffix.BlogPosts}`
    );
  }

  public addPost(request: AddPostRequest): Observable<Post> {
    return this.http.post<Post>(
      `${baseUrl}/${ServiceSuffix.BlogPosts}`,
      request
    );
  }

  public patchPost(
    id: number,
    post: Partial<AddPostRequest>
  ): Observable<void> {
    const request = Object.keys(post).map((key) => {
      const property = new PatchPostRequest();
      property.op = 'replace';
      property.path = PatchPostRequestPath[key];
      property.value = post[key];
      return property;
    });
    return this.http.patch<void>(
      `${baseUrl}/${ServiceSuffix.BlogPosts}/${id}`,
      request
    );
  }

  public searchPosts(searchTerm: string): Observable<GetPostsResponse> {
    return this.http.get<GetPostsResponse>(
      `${baseUrl}/${ServiceSuffix.BlogPosts}/Search?term=${searchTerm}`
    );
  }

  public getPostsByCategory(categoryId: number): Observable<GetPostsResponse> {
    return this.http.get<GetPostsResponse>(
      `${baseUrl}/${ServiceSuffix.BlogPosts}/GetPostByCategory?categoryId=${categoryId}`
    );
  }

  public deletePost(id: number): Observable<void> {
    return this.http.delete<void>(
      `${baseUrl}/${ServiceSuffix.BlogPosts}/${id}`
    );
  }

  public addCategory(request: AddCategoryRequest): Observable<Category> {
    return this.http.post<Category>(
      `${baseUrl}/${ServiceSuffix.Category}`,
      request
    );
  }

  public getCategories(): Observable<GetCategoriesResponse> {
    return this.http.get<GetCategoriesResponse>(
      `${baseUrl}/${ServiceSuffix.Category}`
    );
  }

  public getCategoryById(categoryId: number): Observable<GetCategoryResponse> {
    return this.http.get<GetCategoryResponse>(
      `${baseUrl}/${ServiceSuffix.Category}/${categoryId}`
    );
  }
}
