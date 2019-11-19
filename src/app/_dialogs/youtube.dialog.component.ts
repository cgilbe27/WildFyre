import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 mat-dialog-title>Enter in the YouTube information</h1>

    <div mat-dialog-actions>
      <mat-input-container>
        <input matInput name="comment" type="text" name="url"
        [(ngModel)]="model.url" #url="ngModel" placeholder="Url of full youtube link">
      </mat-input-container>
      <mat-input-container>
        <input matInput name="comment" type="text" name="altText"
        [(ngModel)]="model.altText" #altText="ngModel" placeholder="Alt text if the video gets removed">
      </mat-input-container>
    </div>
    <br>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="sendYouTubeInformation()">Ok</button>
    <button mat-button mat-dialog-close="false">Cancel</button>
  </div>
  `
})
export class YouTubeDialogComponent {
  model: any = {};
  constructor(
    public dialogRef: MatDialogRef<YouTubeDialogComponent>
    ) { }

    sendYouTubeInformation() {
      const message = {
        'url': this.model.url,
        'altText' : this.model.altText
      };

      this.dialogRef.close(message);
    }
}
