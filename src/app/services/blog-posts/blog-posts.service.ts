import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../base-url';
import { ServiceSuffix } from '../service-suffix';
import { Post } from './models/post';
import { AddPostRequest } from './models/requests/add-post-request';
import { PatchPostRequest } from './models/requests/patch-post-request';
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

  public patchPost(id: number, request: PatchPostRequest): Observable<any> {
    return this.http.patch<any>(
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

  public deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/${ServiceSuffix.BlogPosts}/${id}`);
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
