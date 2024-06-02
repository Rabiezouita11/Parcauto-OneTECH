import { Component , Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reservation } from 'src/app/model/Reservation';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent  {

  constructor(@Inject(MAT_DIALOG_DATA) public reservations: Reservation[]) { }

}
