import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { Post } from 'src/app/services/blog-posts/models/post';
import { AddEditPostDialogComponent } from '../add-edit-post-dialog/add-edit-post-dialog.component';
import { ConfirmationDialogModel } from '../confirmation-dialog/models/confirmation-dialog-model';
import { MessageService } from './../../services/message-service/message.service';
import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  @Input()
  public post: Post;

  @Output()
  public postEvent = new EventEmitter<void>();

  constructor(
    private blogPostsService: BlogPostsService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  public editPost(): void {
    const dialogRef = this.dialog.open(AddEditPostDialogComponent, {
      data: this.post,
      width: '40rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.postEvent.emit();
      }
    });
  }

  public deletePost(): void {
    const dialogData = new ConfirmationDialogModel(
      'Are you sure you want to delete this post?',
      'warning'
    );

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.blogPostsService
          .deletePost(this.post.id)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.setErrorMessage(
                'Something went wrong with deleting the post, please try again.'
              );
              return of(error);
            })
          )
          .subscribe((error: void | HttpErrorResponse) => {
            if (!error) {
              this.setInfoMessage('Post was successfully deleted.');
              this.postEvent.emit();
            }
          });
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
}
