import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Post } from '../_models/post';

declare const Compressor: any;

@Component({
  template: `
  <h1 mat-dialog-title>Upload Your Pictures</h1>

  <img id="image" />

  <div fxLayout="row" class="imageUpload-button" fxFlexOffset="2rem">
    <button mat-flat-button class="imageUpload-button" style="background: #EA6C40;">Upload Image</button>
    <input id="imageUpload-upload" type="file" accept="image/jpg, image/jpeg, image/png" (change)="uploadImage()" hidden/>
  </div>

  Comment:
  <mat-form-field>
    <input matInput type="text" name="comment" [(ngModel)]="model.comment" #comment="ngModel" />
  </mat-form-field>

  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="returnInformation(true)">Add additional image</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `,
  styleUrls: ['./imageUpload.component.scss']
})
export class PicturesDialogComponent {
  area = '';
  data: any;
  model: any = {};
  nums_taken: number[] = [];
  post: Post = new Post(null, null, false, null, null, null, 's', null, [], []);
  picture: any;
  pUrl: string;

  constructor(
    public dialogRef: MatDialogRef<PicturesDialogComponent>,
    public snackBar: MatSnackBar
    ) {
      this.model.comment = '';
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
      let availableSlot: number = this.nums_taken.length;

      for (let i = 0; i < this.nums_taken.length; i++) {
        if (this.nums_taken[i] !== i) {
          availableSlot = i;
          break;
        }
      }
      const message = {
        'picture': this.picture,
        'bool': bool,
        'comment': this.model.comment,
        'slot': availableSlot
      };

      this.snackBar.open('Your image is attached but still needs to be added to the post body', 'Okay', {
        duration: 20000
      });

      this.dialogRef.close(message);
    }
}
