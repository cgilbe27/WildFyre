import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 mat-dialog-title>Change Email</h1>
    <mat-form-field>
      <input matInput type="text" name="email" [(ngModel)]="model.email" #email="ngModel">
    </mat-form-field>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="returnInformation(true)">Change Email</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class EmailDialogComponent {
  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<EmailDialogComponent>
    ) { }

    returnInformation(bool: boolean) {
      const message = {
        'email': this.model.email,
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
