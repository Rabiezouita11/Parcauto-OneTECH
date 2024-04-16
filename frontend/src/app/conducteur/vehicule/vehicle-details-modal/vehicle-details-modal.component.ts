import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vehicle-details-modal',
  templateUrl: './vehicle-details-modal.component.html',
  styleUrls: ['./vehicle-details-modal.component.scss']
})
export class VehicleDetailsModalComponent   {

  constructor(@Inject(MAT_DIALOG_DATA) public vehicle: any) { }



}
