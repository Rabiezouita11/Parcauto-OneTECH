import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BoardData} from "../../../interfaces/board-data";

@Component({
  selector: 'app-delete-board-dialog',
  templateUrl: './delete-board-dialog.component.html',
  styleUrls: ['./delete-board-dialog.component.scss']
})
export class DeleteBoardDialogComponent {


  constructor(public dialogRef: MatDialogRef<DeleteBoardDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: BoardData) {
  }


  closeDialog() {
    this.dialogRef.close();
  }

  confirmDialog() {

  }

}
