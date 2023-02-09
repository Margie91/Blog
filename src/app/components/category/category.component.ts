import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogPostsService } from 'src/app/services/blog-posts/blog-posts.service';
import { Category } from './../../services/blog-posts/models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public $categories: Observable<any>;

  @Output()
  public pickedCategory = new EventEmitter<number>();

  constructor(private blogService: BlogPostsService) {}

  ngOnInit() {
    this.$categories = this.blogService.getCategories();
  }

  public onClickCategory(category: Category): void {
    if (category) {
      this.pickedCategory.emit(category.id);
    } else {
      this.pickedCategory.emit(null);
    }
  }
}
