import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileUpdateService } from 'src/app/Service/ProfileUpdateService/profile-update-service.service';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  token: string | null;
  userId: any;
  fileName: any;
  firstName: any;
  lastName: any;
  email: any;
  role: any;
  userName: any;
  selectedFile: File | null = null;
  profileImage!: File | null;
  user: any = {};
  isAdmin: boolean = false; // Add a property to track if the user is an admin

  constructor(private userService: UserService, private profileUpdateService: ProfileUpdateService, private router: Router) {
    this.token = localStorage.getItem('jwtToken');
    this.checkUserRole(); // Call the method to check user role when the component is initialized

  }




  deleteAccount(): void {
    // Show a confirmation dialog before deleting the account
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the deleteUser method if user confirms
        this.userService.deleteUser(this.userId).subscribe(
          () => {
            // If deletion is successful, show a success message
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Votre compte a été supprimé avec succès',
              confirmButtonText: 'OK'
            }).then(() => {
              // After success, navigate to login page
              this.router.navigate(['/auth/login']).then(() => {
                // After navigation, force a page reload
                window.location.reload();
              });
            });
          },
          (error) => {
            // If an error occurs during deletion, show an error message
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur s\'est produite lors de la suppression du compte. Veuillez réessayer plus tard.',
              confirmButtonText: 'OK'
            });
            console.error('Error deleting account:', error);
          }
        );
      }
    });
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

      }, (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      });
    } else {
      console.error('Jeton non trouvé dans le stockage local');
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateProfile(): void {
    if (!this.token || !this.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le jeton ou l\'identifiant utilisateur est manquant',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Créer un objet FormData
    const formData = new FormData();
    formData.append('id', this.userId);
    formData.append('username', this.userName);
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('email', this.email);
    // Ajouter le fichier
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    // Envoyer l'objet FormData au backend
    this.userService.updateProfile(formData, this.token).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Profil mis à jour avec succès',
          confirmButtonText: 'OK'
        });
        // Éventuellement, mettre à jour des éléments de l'interface utilisateur ou afficher un message de succès
        this.profileUpdateService.triggerProfileUpdated();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de la mise à jour du profil. Veuillez réessayer plus tard.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  checkUserRole(): void {
    // Check the user's role
    if (this.role === 'ADMIN') {
      this.isAdmin = true;
    }
  }
}
