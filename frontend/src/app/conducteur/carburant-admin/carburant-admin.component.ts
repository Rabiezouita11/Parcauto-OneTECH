import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConducteurService } from 'src/app/Service/Conducteur/conducteur.service';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { VehicleService } from 'src/app/Service/VehicleService/vehicle-service.service';
import { Carburant } from 'src/app/model/Carburant';
import { ReservationDetailsComponent } from './reservation-details/reservation-details.component';

@Component({
  selector: 'app-carburant-admin',
  templateUrl: './carburant-admin.component.html',
  styleUrls: ['./carburant-admin.component.scss']
})
export class CarburantAdminComponent implements OnInit {
  carburants: Carburant[] = []; // To store carburant data
  token: string | null;
  selectedReservationId: number | null = null;

  constructor(private dialog: MatDialog, private ConducteurService : ConducteurService ,private reservationService: ReservationService, private vehicleService: VehicleService, private userService: UserService) {
    this.token = localStorage.getItem('jwtToken');

  }
  ngOnInit(): void {
    this.loadCarburants();

  }
  async loadCarburants(): Promise<void> {
    this.ConducteurService.getAllCarburants().subscribe(carburants => {
        this.carburants = carburants;
        
    }, error => {
        console.error('Error loading carburants:', error);
    });
}
openReservationModal(reservationId: number): void {
  // Appel à votre service pour récupérer toutes les réservations
  this.reservationService.getAllReservations().subscribe(reservations => {
    // Recherche de la réservation correspondant à l'ID donné
    const selectedReservation = reservations.find(reservation => reservation.id === reservationId);
    this.dialog.open(ReservationDetailsComponent, {
      width: '400px',
      data: selectedReservation
    });
    if (selectedReservation) {
      // Si une réservation correspondante est trouvée, affichez ses détails dans la console (ou effectuez toute autre logique que vous souhaitez)
      console.log(selectedReservation);
      // Vous pouvez ajouter ici la logique pour afficher les détails de la réservation dans la modale
    } else {
      console.error('Reservation not found');
    }
  }, error => {
    console.error('Error loading reservations:', error);
  });
}

}
