import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { Post } from 'src/app/services/blog-posts/models/post';
import { Category } from './../../services/blog-posts/models/category';
import { AddPostRequest } from './../../services/blog-posts/models/requests/add-post-request';
import { MessageService } from './../../services/message-service/message.service';

@Component({
  selector: 'app-add-edit-post-dialog',
  templateUrl: './add-edit-post-dialog.component.html',
  styleUrls: ['./add-edit-post-dialog.component.scss'],
})
export class AddEditPostDialogComponent implements OnInit {
  public form: FormGroup;
  public categories: Category[];
  public posting = false;

  constructor(
    private blogService: BlogPostsService,
    private messageService: MessageService,
    private dialogRef: MatDialogRef<AddEditPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.blogService.getCategories().subscribe((response) => {
      this.categories = response.resultData;
    });
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
      postCategory: new FormControl(''),
    });
    if (this.data) {
      this.form.patchValue({ title: this.data.title, text: this.data.text });
      if (this.data?.categoryId) {
        this.blogService
          .getCategoryById(this.data.categoryId)
          .subscribe((response) => {
            this.form.patchValue({
              postCategory: response.resultData,
            });
          });
      }
    }
  }

  public categoryValueDisplay(value1, value2) {
    if (value1.id == value2.id) {
      return value1.name;
    } else {
      return '';
    }
  }

  public post(): void {
    this.posting = true;
    const { title, text, postCategory } = this.form.value;
    const request = new AddPostRequest();
    if (this.data?.id) {
      request.title = title || this.data.title;
      request.text = text || this.data.text;
      request.categoryId = postCategory.id || this.data.categoryId;
      this.blogService
        .patchPost(this.data.id, request)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.setErrorMessage(
              'Something went wrong with saving the post, please try again.'
            );
            return of(error);
          })
        )
        .subscribe((error) => {
          this.posting = false;
          if (error) {
            this.dialogRef.close(false);
          } else {
            this.setInfoMessage('Post successfully updated.');
            this.dialogRef.close(true);
          }
        });
    } else {
      request.title = title;
      request.text = text;
      request.categoryId = postCategory?.id;
      this.blogService
        .addPost(request)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.setErrorMessage(
              'Something went wrong with saving the post, please try again.'
            );
            return of(error);
          })
        )
        .subscribe((response: Post | HttpErrorResponse) => {
          this.posting = false;

          if (response instanceof HttpErrorResponse) {
            this.dialogRef.close(false);
          } else {
            this.setInfoMessage('Post successfully created.');
            this.dialogRef.close(response);
          }
        });
    }
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
