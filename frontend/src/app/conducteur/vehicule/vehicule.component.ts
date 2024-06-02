import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehicleService } from 'src/app/Service/VehicleService/vehicle-service.service';
import { Vehicle } from 'src/app/model/Vehicle';
import Swal from 'sweetalert2';
import { VehicleDetailsModalComponent } from './vehicle-details-modal/vehicle-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { VehiculeUpdateModalComponent } from './vehicule-update-modal/vehicule-update-modal.component';

@Component({
  selector: 'app-vehicule',
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.scss']
})
export class VehiculeComponent implements OnInit {
  @ViewChild('exampleModal') exampleModal!: ElementRef;
  vehicleForm!: FormGroup;

  vehicles!: Vehicle[];
  errorMessage!: string;
  vehicle: Vehicle = {
    id: 0,
    marque: '',
    matricule: '',
    modele: '',
   
    numeroSerie: '',
    kilometrage: 0,
    disponibilite: true
  };
  currentYear: number;

  constructor(private fb: FormBuilder ,private vehicleService: VehicleService ,private dialog: MatDialog) { 
    this.currentYear = new Date().getFullYear();

  }

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      marque: ['', Validators.required],
      matricule: ['', Validators.required],
      modele: ['', Validators.required],
      annee: ['', [Validators.required, Validators.min(1886), Validators.max(this.currentYear)]],
      numeroSerie: ['', Validators.required],
      kilometrage: ['', Validators.required]
    });
    this.getAllVehicles();
  }

  getAllVehicles(): void {

    
    this.vehicleService.getAllVehicles()
      .subscribe(
        vehicles => {
          this.vehicles = vehicles;
        },
        error => {
          this.errorMessage = error;
        }
      );
  }
  openDetailsModal(vehicle: any): void {
    this.dialog.open(VehicleDetailsModalComponent, {
      width: '400px',
      data: vehicle
    });
  }
  openUpdate(vehicle: any): void {
    const dialogRef = this.dialog.open(VehiculeUpdateModalComponent, {
      width: '400px',
      data: vehicle
    });

    dialogRef.componentInstance.vehicleUpdated.subscribe(() => {
      this.getAllVehicles(); // Refresh the list of vehicles
    });
  }
  addVehicle(): void {
    if (this.vehicleForm.invalid) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    this.vehicleService.createVehicle(this.vehicleForm.value).subscribe(
      (response) => {
        Swal.fire('Success', 'Vehicle added successfully', 'success');
        this.ngOnInit(); // Assuming ngOnInit is a method in the component
      },
      (error) => {
        if (error.error && error.error.message === 'vehicle deja existe') {
          Swal.fire('Error', 'vehicle deja existe', 'error');
        } else {
          Swal.fire('Error', 'vehicle deja existe', 'error');
        }
      }
    );
  }



  updateVehicle(id: number, vehicle: Vehicle): void {
    this.vehicleService.updateVehicle(id, vehicle)
      .subscribe(
        updatedVehicle => {
          const index = this.vehicles.findIndex(v => v.id === id);
          if (index !== -1) {
            this.vehicles[index] = updatedVehicle;
          }
        },
        error => {
          this.errorMessage = error;
        }
      );
  }

  deleteVehicle(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer ce véhicule!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, le supprimer!',
      cancelButtonText: 'Non, annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehicleService.deleteVehicle(id)
          .subscribe(
            () => {
              this.vehicles = this.vehicles.filter(v => v.id !== id);
              Swal.fire(
                'Supprimé!',
                'Votre véhicule a été supprimé.',
                'success'
              );
            },
            error => {
              this.errorMessage = error;
              // Afficher le message d'erreur avec SweetAlert
              Swal.fire(
                'Erreur!',
                'Impossible de supprimer le véhicule car il est occupé par une réservation.',
                'error'
              );
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          'Votre véhicule est en sécurité :)',
          'error'
        );
      }
    });
  }
  
  
  
}
