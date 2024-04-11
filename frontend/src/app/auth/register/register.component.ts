import {Component, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';
import { ScriptAuthService } from 'src/app/Service/scriptAuth/script-auth.service';
import Swal from 'sweetalert2';

@Component({selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.css']})
export class RegisterComponent implements OnInit {
    isLoginPage!: boolean;

    user : any = {};
    selectedImage : File | null = null; // Variable to store selected image file

    constructor(private router : Router, private scriptStyleLoaderService : ScriptAuthService, private userService : UserService) {}

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
                        title: 'Registration Failed',
                        text: 'User already exists. Please try with a different username.',
                        confirmButtonText: 'OK'
                    });
                } else if (response.message === 'User with this email already exists') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Failed',
                        text: 'User with this email already exists. Please try with a different email.',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful',
                        text: 'You have successfully registered.',
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
                    title: 'Registration Failed',
                    text: 'Failed to register. Please try again later.',
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
                    title: 'Image Size Exceeded',
                    text: 'The selected image size exceeds the maximum allowed size (5 MB). Please select a smaller image.'
                });
                return;
            }
            
            // Set the selected image
            this.selectedImage = file;
        }
    }
    
}
