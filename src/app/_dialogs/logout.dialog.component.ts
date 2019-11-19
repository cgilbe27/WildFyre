import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 mat-dialog-title>Are you sure you want to logout?</h1>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="returnInformation(true)">Yes</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class LogoutDialogComponent {
  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<LogoutDialogComponent>
    ) { }

    returnInformation(bool: boolean) {
      const message = {
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
