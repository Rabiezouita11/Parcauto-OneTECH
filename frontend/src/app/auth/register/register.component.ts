import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import { ScriptAuthService } from 'src/app/Service/scriptAuth/script-auth.service';
import Swal from 'sweetalert2';

@Component({ selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.css'] })
export class RegisterComponent implements OnInit {
    isLoginPage!: boolean;

    user: any = {};
    selectedImage: File | null = null; // Variable to store selected image file

    constructor(private router: Router, private scriptStyleLoaderService: ScriptAuthService, private userService: UserService) { }

    ngOnInit(): void {

    }

    registerUser(): void {
        const formData = new FormData();
        formData.append('firstName', this.user.firstName);
        formData.append('lastName', this.user.lastName);
        formData.append('email', this.user.email);
        formData.append('username', this.user.username);
        formData.append('password', this.user.password);
        formData.append('role', this.user.role);
        if (this.selectedImage) {
            formData.append('image', this.selectedImage, this.selectedImage.name);
        }

        this.userService.register(formData).subscribe(
            (response) => {
                console.log('Registration successful:', response.message);
                if (response.message === 'User already exists') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Échec de l\'inscription',
                        text: 'L\'utilisateur existe déjà. Veuillez essayer avec un nom d\'utilisateur différent.',
                        confirmButtonText: 'OK'
                    });
                } else if (response.message === 'User with this email already exists') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Échec de l\'inscription',
                        text: 'Un utilisateur avec cet email existe déjà. Veuillez essayer avec un email différent.',
                        confirmButtonText: 'OK'
                    });
                } else {
                    console.log(this.user.email)
                    // Registration successful, send verification code
                    this.sendVerificationCode(this.user.email);

                    Swal.fire({
                        icon: 'success',
                        title: 'Inscription réussie',
                        text: 'Vous vous êtes inscrit avec succès. Votre compte sera vérifié par l\'administrateur. Vous recevrez une notification par email une fois votre compte vérifié.',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        this.router.navigateByUrl('/auth/login');
                    });
                }
            },
            (error) => {
                console.error('Registration failed:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Échec de l\'inscription',
                    text: 'Échec de l\'inscription. Veuillez réessayer plus tard.',
                    confirmButtonText: 'OK'
                });
            }
        );
    }

    sendVerificationCode(email: string): void {
        this.userService.sendVerificationCode(email).subscribe(
            (response) => {
                console.log('Verification code sent:', response.message);
                Swal.fire({
                    icon: 'success',
                    title: 'Code de vérification envoyé',
                    text: response.message,
                    confirmButtonText: 'OK'
                });
            },
            (error) => {
                console.error('Sending verification code failed:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Échec de l\'envoi du code de vérification',
                    text: 'Échec de l\'envoi du code de vérification. Veuillez réessayer plus tard.',
                    confirmButtonText: 'OK'
                });
            }
        );
    }

    onImageSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            // Check if the file size exceeds the maximum allowed size (in bytes)
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSize) {
                // Reset the selected image
                this.selectedImage = null;
                // Display an error message using Swal
                Swal.fire({
                    icon: 'error',
                    title: 'Taille de l\'image dépassée',
                    text: 'La taille de l\'image sélectionnée dépasse la taille maximale autorisée (5 Mo). Veuillez sélectionner une image plus petite.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Set the selected image
            this.selectedImage = file;
        }
    }

    resetForm(form: any): void {
        form.resetForm();
    }
}
