import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';

declare const Compressor: any;

@Component({
  template: `
  <h1 mat-dialog-title>Upload Your Picture</h1>

  <img id="image" />

  <div fxLayout="row" class="imageUpload-button" fxFlexOffset="2rem">
    <button mat-flat-button class="imageUpload-button" style="background: #EA6C40;">Upload Image</button>
    <input id="imageUpload-upload" type="file" accept="image/jpg, image/jpeg, image/png" (change)="uploadImage()" hidden/>
  </div>

  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="returnInformation(true)">Add image</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `,
  styleUrls: ['./imageUpload.component.scss']
})
export class PictureDialogComponent {
  comment: boolean;
  data: any;
  model: any = {};
  picture: any;
  pUrl: string;

  constructor(
    public dialogRef: MatDialogRef<PictureDialogComponent>,
    public snackBar: MatSnackBar
    ) { }

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
        'picture': this.picture,
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
