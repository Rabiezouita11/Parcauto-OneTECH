import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ConducteurService} from 'src/app/Service/Conducteur/conducteur.service';
import {ReservationService} from 'src/app/Service/Reservation/reservation.service';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {Carburant} from 'src/app/model/Carburant';
import { Report } from 'src/app/model/Report';
import {Reservation} from 'src/app/model/Reservation';
import Swal from 'sweetalert2';

@Component({selector: 'app-carburant-conducteur', templateUrl: './carburant-conducteur.component.html', styleUrls: ['./carburant-conducteur.component.scss']})
export class CarburantConducteurComponent implements OnInit {
    reservations : Reservation[] = [];
    token : string | null;
    userId : any;
    fileName : any;
    firstName : any;
    lastName : any;
    email : any;
    role : any;
    userName : any;
    carburants: Carburant[] = []; // To store carburant data
    reports: Report[] = []; // To store carburant data

   
    selectedReservation : Reservation | null = null; // Selected reservation for fuel management

    rapport: any = {};
    panneVoitureDescription: string = '';
    panneVoitureLocation: string = '';
    maintenanceType: string = '';
    maintenanceDate: Date = new Date();
    accidentDescription: string = '';
    accidentDate: Date = new Date();
    fuelData : any = { // Object to hold data for fuel management
        kilometrageDebut: null,
        kilometrageFin: null,
        quantiteCarburantUtiliser: null,
        carburantConsome: null
    };
    reservationId: any;

    constructor(private cdr : ChangeDetectorRef, private reservationService : ReservationService, private ConducteurService : ConducteurService, private userService : UserService) {
        this.token = localStorage.getItem('jwtToken');

    }

    ngOnInit(): void {
        this.getInfo();
        this.loadCarburants();
        this.loadReports();
    }

    // Inside your component class
 
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
            this.ConducteurService.getReservationsByUserId(this.userId).subscribe(reservations => {
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
                this.reservationService.getUsernameById(reservation.userIdConnected).subscribe(username => reservation.connectedUserName = username, error => console.error('Error fetching user details', error));
            }
        }
    }
    openFuelManagementModal(reservation : any): void { // Calculate quantiteCarburantUtiliser based on reservation.montant
        this.selectedReservation = reservation;

        if (reservation && reservation.montant) {
            this.fuelData.quantiteCarburantUtiliser = (reservation.montant / 2.525).toFixed(4);


            // Trigger change detection
            this.cdr.detectChanges();
        } else { // Handle the case where reservation or montant is not available
            console.error('Reservation or montant not available');
        }

        console.log(this.fuelData)
    }
    submitFuelManagementForm(): void {
        if (!this.selectedReservation) {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'No reservation selected!'});
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
            userId: this.userId
        };

        // Call the service to save carburant data
        this.ConducteurService.saveCarburant(carburantData).subscribe((result) => { // Handle success
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Les données du carburant ont été enregistrées avec succès !'
          });            this.ngOnInit();
            // Optionally, reset form data or perform any other actions
        }, (error) => { // Handle error
            Swal.fire({icon: 'error', title: 'Error', text: error.message});
        });
    }
    loadReports() {
      this.ConducteurService.getAllReport().subscribe(report => {
        this.reports = report;
    }, error => {
        console.error('Error loading reports:', error);
    });
    }
    isReportsExists(reservationId: number): boolean {
      return this.reports.some(report => report.reservationId === reservationId);
    }

    loadCarburants(): void {
        this.ConducteurService.getAllCarburants().subscribe(carburants => {
            this.carburants = carburants;
        }, error => {
            console.error('Error loading carburants:', error);
        });
    }
    isCarburantExists(reservationId: number): boolean {
      return this.carburants.some(carburant => carburant.reservation_id === reservationId);
    }

    loadCarburantsForReservation(reservationId: number): void {
      // Filter carburants based on the reservation ID
      this.carburants = this.carburants.filter(carburant => carburant.reservation_id === reservationId);
    }

    prepareCreateReport(reservationId: any) {
      this.reservationId = reservationId;
    }
  // Method to create report
  createReport() {
    let reportData: any = {};
    console.log(this.reservationId); // Check if the reservationId is received correctly

    switch (this.rapport.selectedCategory) {
      case 'panneVoiture':
        reportData = {
          reservationId: this.reservationId,
          category: this.rapport.selectedCategory,
          description: this.panneVoitureDescription,
          location: this.panneVoitureLocation,
          userId: this.userId

        };
        break;
      case 'maintenance':
        reportData = {
          reservationId: this.reservationId,
          category: this.rapport.selectedCategory,
          type: this.maintenanceType,
          date: this.maintenanceDate,
          userId: this.userId
        };
        break;
      case 'accident':
        reportData = {
          reservationId: this.reservationId,
          category: this.rapport.selectedCategory,
          description: this.accidentDescription,
          date: this.accidentDate,
          userId: this.userId
        };
        break;
      default:
        Swal.fire('Erreur', 'Vous devez sélectionner une catégorie de rapport.', 'error');

        return;
    }
  
    this.ConducteurService.createReport(reportData)
      .subscribe(
        response => {
          console.log('Report created successfully:', response);
          Swal.fire('Succès', 'Le rapport a été créé avec succès!', 'success');
          this.ngOnInit();
        },
        error => {
          console.error('Error creating report:', error);
          Swal.fire('Error', 'Failed to create report', 'error');
        }
      );
  }
  showReportDetails(reservation: Reservation) {
    this.selectedReservation = reservation;
  }
}
