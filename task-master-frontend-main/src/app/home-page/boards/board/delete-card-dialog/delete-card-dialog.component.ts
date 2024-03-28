import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BoardData} from "../../../../interfaces/board-data";

@Component({
  selector: 'app-delete-card-dialog',
  templateUrl: './delete-card-dialog.component.html',
  styleUrls: ['./delete-card-dialog.component.scss']
})
export class DeleteCardDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteCardDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: BoardData) {
  }


  closeDialog() {
    this.dialogRef.close();
  }

  confirmDialog() {

  }

}
