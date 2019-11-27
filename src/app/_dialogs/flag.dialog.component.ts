import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Choice } from '../_models/choice';
import { AreaService } from '../_services/area.service';
import { ReasonService } from '../_services/reason.service';

enum TypeOfReport {
  Post,
  Comment
}

@Component({
  template: `
  <h1 mat-dialog-title>Please choose a flag reason:</h1>

  <div mat-dialog-actions>
    <mat-radio-group class="radio-group" [(ngModel)]="clickedChoice">
      <mat-radio-button class="example-radio-button" *ngFor="let choice of flagChoices" [value]="choice.key">
        {{choice.value}}
        <br>
      </mat-radio-button>
    </mat-radio-group>

    <mat-form-field>
      <textarea matInput name="comment" rows="3" cols="40" type="text" name="report"
      [(ngModel)]="model.report" #report="ngModel" placeholder="Explain what is wrong.."></textarea>
    </mat-form-field>
  </div>
  <br>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="sendReport()">Ok</button>
    <button mat-button mat-dialog-close="false">Cancel</button>
  </div>
  `
})
export class FlagDialogComponent {
  flagChoices: Choice[] = [];
  clickedChoice: string;
  model: any = {};
  typeOfReport: TypeOfReport;

  constructor(
    public dialogRef: MatDialogRef<FlagDialogComponent>,
    private reasonService: ReasonService,
    private areaService: AreaService
    ) {

      if (this.reasonService.flagChoices.length === 0) {
        this.reasonService.getFlagReasons()
          .subscribe( (choices: Choice[]) => {
            this.flagChoices = choices;
            this.reasonService.flagChoices = choices;
        });
      } else {
        this.flagChoices = this.reasonService.flagChoices;
      }
    }

    sendReport() {
      this.areaService.currentArea
        .subscribe(currentArea => {
          const message = {
            'typeOfReport': this.typeOfReport,
            'report': this.model.report,
            'choice': this.clickedChoice,
            'area': currentArea.name
          };

          this.dialogRef.close(message);
        });
  }
}
