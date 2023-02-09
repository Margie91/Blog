import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { Post } from 'src/app/services/blog-posts/models/post';
import { AddPostDialogComponent } from '../add-post-dialog/add-post-dialog.component';
import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input()
  public post: Post;

  @Output()
  public postDeleted = new EventEmitter<void>();

  @Output()
  public postEdited = new EventEmitter<void>();

  constructor(
    private blogPostsService: BlogPostsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  public editPost(): void {
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      data: this.post,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.postDeleted.emit();
      }
    });
  }

  public deletePost(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.blogPostsService.deletePost(this.post.id).subscribe((res) => {
          this.postDeleted.emit();
        });
      }
    });
  }
}
