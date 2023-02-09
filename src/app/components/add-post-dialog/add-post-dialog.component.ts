import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { Post } from 'src/app/services/blog-posts/models/post';
import { Category } from './../../services/blog-posts/models/category';
import { AddPostRequest } from './../../services/blog-posts/models/requests/add-post-request';
import { PatchPostRequest } from './../../services/blog-posts/models/requests/patch-post-request';

@Component({
  selector: 'app-add-post-dialog',
  templateUrl: './add-post-dialog.component.html',
  styleUrls: ['./add-post-dialog.component.scss'],
})
export class AddPostDialogComponent implements OnInit {
  public form: FormGroup;
  public categories: Category[];
  constructor(
    private blogService: BlogPostsService,
    private dialogRef: MatDialogRef<AddPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.blogService.getCategories().subscribe((response) => {
      this.categories = response.resultData;
    });
  }

  private initializeForm(): void {
    console.log(this.categories);
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      text: new FormControl('', [Validators.required, Validators.minLength(2)]),
      postCategory: new FormControl(''),
    });
    if (this.data) {
      this.form.patchValue({ title: this.data.title, text: this.data.text });
      if (this.data?.categoryId) {
        this.blogService
          .getCategoryById(this.data?.categoryId)
          .subscribe((response) => {
            this.form.setValue({
              postCategory: response.resultData.name,
              title: this.data.title,
              text: this.data.text,
            });
            // this.form.patchValue({
            //   postCategory: response.resultData,
            // });
            console.log(this.form.value);
          });
      }
    }
  }

  public post(): void {
    const { title, text, postCategory } = this.form.value;
    console.log(postCategory);
    const request = new AddPostRequest();
    request.title = title;
    request.text = text;
    request.categoryId = postCategory?.id;
    if (this.data?.id) {
      const updateReq = new PatchPostRequest();
      updateReq.id = this.data.id;
      updateReq.title = title;
      updateReq.text = text;
      updateReq.categoryId = postCategory?.id;
      this.blogService
        .patchPost(this.data.id, updateReq)
        .subscribe((response) => {
          console.log(response);
          this.dialogRef.close(true);
        });
    } else {
      this.blogService.addPost(request).subscribe((response: Post) => {
        this.dialogRef.close(response);
      });
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
