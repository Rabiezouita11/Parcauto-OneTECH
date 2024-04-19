import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleService } from 'src/app/Service/VehicleService/vehicle-service.service';
import { Vehicle } from 'src/app/model/Vehicle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicule-update-modal',
  templateUrl: './vehicule-update-modal.component.html',
  styleUrls: ['./vehicule-update-modal.component.scss']
})
export class VehiculeUpdateModalComponent {
  updatedVehicle!: Vehicle; // Variable to store the updated vehicle

  constructor(
    @Inject(MAT_DIALOG_DATA) public vehicle: Vehicle,
    public dialogRef: MatDialogRef<VehiculeUpdateModalComponent>,
    private vehicleService: VehicleService // Inject the VehicleService
  ) {
    // Initialize updatedVehicle with the current vehicle details
    this.updatedVehicle = { ...vehicle };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateVehicle(): void {
    // Call the updateVehicle method of VehicleService with the vehicle ID and the updated vehicle details
    this.vehicleService.updateVehicle(this.updatedVehicle.id, this.updatedVehicle).subscribe(
      updatedVehicle => {
        // If the update is successful, close the dialog and show a success message
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle details updated successfully!',
          confirmButtonText: 'OK'
        });
      },
      error => {
        console.error('Error updating vehicle:', error);
        // If there's an error, show an error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update vehicle details. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  
}
