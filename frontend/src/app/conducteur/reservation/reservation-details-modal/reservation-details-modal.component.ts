import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reservation-details-modal',
  templateUrl: './reservation-details-modal.component.html',
  styleUrls: ['./reservation-details-modal.component.scss']
})
export class ReservationDetailsModalComponent  {

  constructor(@Inject(MAT_DIALOG_DATA) public reservation: any) { }



}
