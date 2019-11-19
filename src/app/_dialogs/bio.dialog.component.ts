import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 mat-dialog-title>Change Bio</h1>
    <mat-form-field>
      <textarea matInput rows="10" cols="80" type="text" class="form-control" name="bio" [(ngModel)]="model.bio" #bio="ngModel"></textarea>
    </mat-form-field>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="returnInformation(true)">Change Bio</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class BioDialogComponent {
  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<BioDialogComponent>
    ) { }

    returnInformation(bool: boolean) {
      const message = {
        'bio': this.model.bio,
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
