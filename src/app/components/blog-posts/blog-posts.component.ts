import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { map, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, shareReplay } from 'rxjs/operators';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { Post } from 'src/app/services/blog-posts/models/post';
import { GetPostsResponse } from './../../services/blog-posts/models/responses/get-posts-response';
import { MessageService } from './../../services/message-service/message.service';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss'],
})
export class BlogPostsComponent implements OnInit, OnChanges {
  @Input()
  private postEventSubject: Subject<void>;

  @Input()
  private searchInputSubject: Subject<string>;

  @Input()
  public pickedCategoryId: number;

  public loadingPosts = true;
  public posts: Post[];
  public noResultsMsg = 'There are no posts right now';
  public $posts: Observable<Post[]>;

  constructor(
    private blogService: BlogPostsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getPosts();
    this.searchInputSubject.subscribe((searchTerm: string) => {
      this.getPosts(searchTerm);
    });
    this.postEventSubject.subscribe(() => {
      this.getPosts();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.pickedCategoryId?.currentValue) {
      this.getPostsByCategory();
    } else {
      this.getPosts();
    }
  }

  private getPosts(searchTerm?: string): void {
    this.loadingPosts = true;
    let $postRequest: Observable<GetPostsResponse>;

    if (searchTerm) {
      $postRequest = this.blogService.searchPosts(searchTerm);
    } else {
      $postRequest = this.blogService.getPosts();
    }
    this.$posts = $postRequest.pipe(
      shareReplay(),
      map((response: GetPostsResponse) => response.resultData),
      map(this.sortByDate),
      catchError(() => {
        this.setErrorMessage(
          'Something went wrong with fetching posts, please try again.'
        );
        return of(null);
      }),
      finalize(() => {
        this.loadingPosts = false;
      })
    );
  }

  private getPostsByCategory(): void {
    this.loadingPosts = true;
    this.$posts = this.blogService
      .getPostsByCategory(this.pickedCategoryId)
      .pipe(
        shareReplay(),
        map((response) => response.resultData),
        map(this.sortByDate),
        catchError(() => {
          this.setErrorMessage(
            'Something went wrong with fetching posts, please try again.'
          );
          return of(null);
        }),
        finalize(() => {
          this.loadingPosts = false;
        })
      );
  }

  private sortByDate(posts: Post[]): Post[] {
    return posts.sort((a, b) =>
      new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
    );
  }

  private setErrorMessage(message: string): void {
    this.messageService.setMessageWithAutoclose({
      message,
      messageType: 'ERROR',
    });
  }

  public onPostEvent(): void {
    this.getPosts();
    this.postEventSubject.next();
  }
}
