import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 mat-dialog-title>Are you sure you want to do this?</h1>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="returnInformation(true)">Yes</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class ConfirmDeletionDialogComponent {
  model: any = {};
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeletionDialogComponent>
    ) { }

    returnInformation(bool: boolean) {
      const message = {
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
