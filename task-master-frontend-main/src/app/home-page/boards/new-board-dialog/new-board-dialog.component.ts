import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-board-dialog',
  templateUrl: './new-board-dialog.component.html',
  styleUrls: ['./new-board-dialog.component.scss']
})
export class NewBoardDialogComponent implements OnInit {

  newBoardForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    visibility: new FormControl("Private", [Validators.required]),
  });

  constructor(public dialogRef: MatDialogRef<NewBoardDialogComponent>) {
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmDialog() {

  }

}
