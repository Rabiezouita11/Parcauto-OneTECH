import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConducteurService } from 'src/app/Service/Conducteur/conducteur.service';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { Carburant } from 'src/app/model/Carburant';
import { Reservation } from 'src/app/model/Reservation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carburant-conducteur',
  templateUrl: './carburant-conducteur.component.html',
  styleUrls: ['./carburant-conducteur.component.scss']
})
export class CarburantConducteurComponent implements OnInit {
  reservations: Reservation[] = [];
  token: string | null;
  userId: any;
  fileName: any;
  firstName: any;
  lastName: any;
  email: any;
  role: any;
  userName: any;
  selectedReservation: Reservation | null = null; // Selected reservation for fuel management
  fuelData: any = {
    // Object to hold data for fuel management
    kilometrageDebut: null,
    kilometrageFin: null,
    quantiteCarburantUtiliser: null,
    carburantConsome: null
  };
  constructor(private cdr: ChangeDetectorRef ,private reservationService: ReservationService,private ConducteurService : ConducteurService , private userService: UserService ) {
    this.token = localStorage.getItem('jwtToken');

   }

  ngOnInit(): void {
    this.getInfo();

  }
  getInfo(): void {

    if (this.token) {
      this.userService.getUserInfo(this.token).subscribe((data) => { // Assuming the response contains the user information in JSON format
        this.userId = data.id;
        this.fileName = data.image;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.role = data.role;
        this.userName = data.username;
        this.loadReservations();

      }, (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      });
    } else {
      console.error('Jeton non trouvé dans le stockage local');
    }
  }
  loadReservations(): void {
    if (this.userId) {
      this.ConducteurService.getReservationsByUserId(this.userId)
        .subscribe(reservations => {
          this.reservations = reservations;
          this.populateConnectedUserNames();

        });
    } else {
      console.error('Impossible de charger les réservations: ID utilisateur non disponible');
    }
  }
  populateConnectedUserNames(): void {
    for (const reservation of this.reservations) {
      if (reservation.userIdConnected) {
        this.reservationService.getUsernameById(reservation.userIdConnected).subscribe(
          username => reservation.connectedUserName = username,
          error => console.error('Error fetching user details', error)
        );
      }
    }
  }
  openFuelManagementModal(reservation: any): void {
    // Calculate quantiteCarburantUtiliser based on reservation.montant
    this.selectedReservation = reservation;

    if (reservation && reservation.montant) {
      this.fuelData.quantiteCarburantUtiliser = (reservation.montant / 2525).toFixed(4);


      // Trigger change detection
      this.cdr.detectChanges();
    } else {
      // Handle the case where reservation or montant is not available
      console.error('Reservation or montant not available');
    }

    console.log(this.fuelData)
  }
submitFuelManagementForm(): void {
  if (!this.selectedReservation) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No reservation selected!'
    });
    return;
  }

  // Retrieve the ID of the selected reservation
  const reservationId = this.selectedReservation.id;

  // Calculate carburantConsome based on the formula
  const carburantConsome = this.fuelData.quantiteCarburantUtiliser / (this.fuelData.kilometrageDebut + this.fuelData.kilometrageFin) * 100;
  console.log(carburantConsome);
  // Create a Carburant object from the form data
  const carburantData: Carburant = {
    reservation_id: reservationId, // Assign the reservation ID here
    kilometrageDebut: this.fuelData.kilometrageDebut,
    kilometrageFin: this.fuelData.kilometrageFin,
    quantiteCarburantUtiliser: this.fuelData.quantiteCarburantUtiliser,
    carburantConsome: carburantConsome, // Assign the calculated value here
  };

  // Call the service to save carburant data
  this.ConducteurService.saveCarburant(carburantData).subscribe(
    (result) => {
      // Handle success
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Carburant data saved successfully!'
      });
      // Optionally, reset form data or perform any other actions
    },
    (error) => {
      // Handle error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    }
  );
}

  
  
  
}
