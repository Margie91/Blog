import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, finalize, Observable, of } from 'rxjs';
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

  @Output()
  public pickedCategory = new EventEmitter<number>();

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
  }

  public onClickCategory(category: Category): void {
    if (category) {
      this.pickedCategory.emit(category.id);
    } else {
      this.pickedCategory.emit(null);
    }
  }

  public addNewCategory(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '20rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(this.loadingCategories);
        this.loadingCategories = true;
        this.$categories = this.blogService.getCategories().pipe(
          catchError((error: HttpErrorResponse) => {
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
