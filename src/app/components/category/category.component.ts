import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, finalize, Observable, of, Subject } from 'rxjs';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { Category } from './../../services/blog-posts/models/category';
import { MessageService } from './../../services/message-service/message.service';
import { AddCategoryComponent } from './../add-category/add-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public $categories: Observable<any>;
  public loadingCategories = true;

  @Input()
  private postEventSubject: Subject<void>;

  @Output()
  public pickedCategory = new EventEmitter<number>();
  public activeCategory = null;

  constructor(
    private blogService: BlogPostsService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.$categories = this.blogService.getCategories().pipe(
      catchError(() => {
        this.setErrorMessage(
          'Something went wrong with fetching categories, please try again.'
        );
        return of(null);
      }),
      finalize(() => {
        this.loadingCategories = false;
      })
    );

    this.postEventSubject.subscribe(() => {
      this.onClickCategory(null);
    });
  }

  public onClickCategory(category: Category): void {
    this.activeCategory = category?.id || null;
    this.pickedCategory.emit(this.activeCategory);
  }

  public addNewCategory(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '20rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingCategories = true;
        this.$categories = this.blogService.getCategories().pipe(
          catchError(() => {
            this.setErrorMessage(
              'Something went wrong with fetching categories, please try again.'
            );
            return of(null);
          }),
          finalize(() => {
            this.loadingCategories = false;
          })
        );
      }
    });
  }

  private setErrorMessage(message: string): void {
    this.messageService.setMessageWithAutoclose({
      message,
      messageType: 'ERROR',
    });
  }
}
