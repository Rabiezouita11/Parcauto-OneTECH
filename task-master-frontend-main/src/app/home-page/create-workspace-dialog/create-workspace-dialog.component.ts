import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-workspace-dialog',
  templateUrl: './create-workspace-dialog.component.html',
  styleUrls: ['./create-workspace-dialog.component.scss']
})
export class CreateWorkspaceDialogComponent implements OnInit {

  newWorkspaceForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl(false, [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  constructor(public dialogRef: MatDialogRef<CreateWorkspaceDialogComponent>) {
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmDialog() {
    if (this.newWorkspaceForm.valid) {
      this.dialogRef.close();
    }
  }
}
