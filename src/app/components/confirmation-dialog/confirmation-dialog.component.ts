import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogModel } from './models/confirmation-dialog-model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  public text: string;
  public matIcon?: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogModel
  ) {
    this.text = this.data.text;
    this.matIcon = this.data.matIcon;
  }

  public confirm(): void {
    this.dialogRef.close(true);
  }

  public cancel(): void {
    this.dialogRef.close(false);
  }
}
