import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AddEditPostDialogComponent } from './components/add-edit-post-dialog/add-edit-post-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public postEventSubject: Subject<void> = new Subject<void>();
  public searchInputSubject: Subject<string> = new Subject<string>();
  public pickedCategoryId: number;
  public readonly searchExperienceField: FormControl = new FormControl(null);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.searchExperienceField.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => this.searchInputSubject.next(value));
  }

  public addPost(): void {
    const dialogRef = this.dialog.open(AddEditPostDialogComponent, {
      width: '40rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.postEventSubject.next();
      }
    });
  }

  public onCategoryPick(event: number): void {
    this.pickedCategoryId = event;
  }
}
