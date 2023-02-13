import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { MessageService } from 'src/app/services/message-service/message.service';
import { Category } from './../../services/blog-posts/models/category';
import { AddCategoryRequest } from './../../services/blog-posts/models/requests/add-category-request';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  public form: FormGroup;
  public saving = false;

  constructor(
    private blogService: BlogPostsService,
    private messageService: MessageService,
    private dialogRef: MatDialogRef<AddCategoryComponent>
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      categoryName: new FormControl('', [Validators.required]),
    });
  }

  public save(): void {
    this.saving = true;
    const { categoryName } = this.form.value;
    const request = new AddCategoryRequest();
    request.name = categoryName;
    this.blogService
      .addCategory(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.setErrorMessage(
            'Something went wrong with creating a category, please try again.'
          );
          return of(error);
        })
      )
      .subscribe((response: Category | HttpErrorResponse) => {
        this.saving = false;

        if (response instanceof HttpErrorResponse) {
          this.dialogRef.close(false);
        } else {
          this.setInfoMessage('Category created.');
          this.dialogRef.close(response);
        }
      });
  }

  private setInfoMessage(message: string): void {
    this.messageService.setMessageWithAutoclose({
      message,
      messageType: 'INFO',
    });
  }

  private setErrorMessage(message: string): void {
    this.messageService.setMessageWithAutoclose({
      message,
      messageType: 'ERROR',
    });
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
