import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { map, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { Post } from 'src/app/services/blog-posts/models/post';
import { GetPostsResponse } from './../../services/blog-posts/models/responses/get-posts-response';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss'],
})
export class BlogPostsComponent implements OnInit, OnChanges {
  @Input()
  private newPostSubject: Subject<void>;

  @Input()
  private searchInputSubject: Subject<string>;

  @Input()
  public pickedCategoryId: number;

  public loadingPosts = true;
  public posts: Post[];
  public noResultsMsg = 'There are no posts right now';
  // public $posts: Observable<Post[]>;
  constructor(private blogService: BlogPostsService) {}

  ngOnInit() {
    this.getPosts();
    this.searchInputSubject.subscribe((searchTerm: string) => {
      this.getPosts(searchTerm);
    });
    this.newPostSubject.subscribe(() => this.getPosts());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.pickedCategoryId?.currentValue) {
      this.getPostsByCategory();
      this.noResultsMsg = 'There are no posts for this category';
    } else {
      this.getPosts();
      this.noResultsMsg = 'There are no posts right now';
    }
  }

  private getPosts(searchTerm?: string): void {
    this.loadingPosts = true;
    let $postRequest;
    if (searchTerm) {
      $postRequest = this.blogService.searchPosts(searchTerm);
    } else {
      $postRequest = this.blogService.getPosts();
    }
    // this.$posts = $postRequest.pipe(
    //   delay(1000),
    //   map((response: GetPostsResponse) => response.resultData),
    //   map(this.sortByDate),
    //   finalize(() => {
    //     this.loadingPosts = false;
    //     console.log(this.loadingPosts);
    //   })
    // );
    $postRequest
      .pipe(
        map((response: GetPostsResponse) => response.resultData),
        map(this.sortByDate),
        finalize(() => {
          this.loadingPosts = false;
          console.log(this.loadingPosts);
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
      });
  }

  private getPostsByCategory(): void {
    this.loadingPosts = true;
    this.blogService
      .getPostsByCategory(this.pickedCategoryId)
      .pipe(
        map((response) => response.resultData),
        map(this.sortByDate),
        finalize(() => {
          this.loadingPosts = false;
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
      });
  }

  private sortByDate(posts): Post[] {
    return posts.sort((a, b) =>
      new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
    );
  }

  public onPostDeleted(): void {
    this.getPosts();
  }
}
