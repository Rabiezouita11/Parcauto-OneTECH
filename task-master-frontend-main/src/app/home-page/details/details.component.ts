import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  constructor(public dialog: MatDialog) { }

 // openVehicleDetailsDialog(): void {
   // const dialogRef = this.dialog.open(VehicleDetailsDialogComponent, {
     // width: '600px', // Définissez la largeur de la boîte de dialogue selon vos besoins
      //ata: {} // Vous pouvez passer des données à la boîte de dialogue si nécessaire
    //});

   // dialogRef.afterClosed().subscribe(result => {
      //console.log('Dialog closed');
      // Vous pouvez ajouter du code à exécuter après la fermeture de la boîte de dialogue si nécessaire
   // });
 // }

}
