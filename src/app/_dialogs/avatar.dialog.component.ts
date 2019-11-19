import { Component, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Author } from '../_models/author';

declare const Compressor: any;

@Component({
  template: `
  <h1 mat-dialog-title>Change Avatar</h1>

  <img id="image" />

  <div fxLayout="row" class="imageUpload-button" fxFlexOffset="2rem">
    <button mat-flat-button class="imageUpload-button" style="background: #EA6C40;">Upload Image</button>
    <input id="imageUpload-upload" type="file" accept="image/jpg, image/jpeg, image/png" (change)="uploadImage()" hidden/>
  </div>

  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="returnInformation(true)">Change Avatar</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `,
  styleUrls: ['./imageUpload.component.scss']
})
export class AvatarDialogComponent {
  author: Author;
  data: any;
  model: any = {};
  picture: any;
  pUrl: string;

  constructor(
    public dialogRef: MatDialogRef<AvatarDialogComponent>,
    public snackBar: MatSnackBar
    ) {
      this.data = {};
    }

    uploadImage() {
      const self = this;
      const file = (<HTMLInputElement>document.getElementById('imageUpload-upload')).files[0];
      const file2: any = new Compressor(file, {
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
        convertSize: 500000,
        success(result: Blob) {
          self.uploadImg(result);
        }
      });
    }

    uploadImg(r: Blob) {
      this.picture = r;
      this.pUrl = URL.createObjectURL(r);
      (<HTMLImageElement>document.getElementById('image')).src = this.pUrl;
    }

    returnInformation(bool: boolean) {
      const message = {
        'profilePicture': this.picture,
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
