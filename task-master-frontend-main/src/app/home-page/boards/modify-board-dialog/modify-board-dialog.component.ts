import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BoardData} from "../../../interfaces/board-data";

@Component({
  selector: 'app-modify-board-dialog',
  templateUrl: './modify-board-dialog.component.html',
  styleUrls: ['./modify-board-dialog.component.scss']
})
export class ModifyBoardDialogComponent implements OnInit {

  modifyBoardForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    visibility: new FormControl("Private", [Validators.required]),
  });

  constructor(public dialogRef: MatDialogRef<ModifyBoardDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: BoardData) {
  }


  closeDialog() {
    this.dialogRef.close();
  }

  confirmDialog() {
    if (this.modifyBoardForm.valid) {

    }
  }

  ngOnInit(): void {
    this.modifyBoardForm.controls['name'].patchValue(this.data.name);
    this.modifyBoardForm.controls['visibility'].patchValue(this.data.visibility);
  }

}
