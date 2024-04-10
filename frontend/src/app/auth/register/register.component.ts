import {Component, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ScriptStyleLoaderService} from 'src/app/Service/script-style-loader/script-style-loader.service';
import Swal from 'sweetalert2';

@Component({selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.css']})
export class RegisterComponent implements OnInit {

    user : any = {};
    selectedImage : File | null = null; // Variable to store selected image file

    constructor(private router : Router, private scriptStyleLoaderService : ScriptStyleLoaderService, private userService : UserService) {}

    ngOnInit(): void {
        const SCRIPT_PATH_LIST = [
            "../../../assets/auth/js/jquery-3.5.0.min.js",
            "../../../assets/auth/js/bootstrap.min.js",
            "../../../assets/auth/js/imagesloaded.pkgd.min.js",
            "../../../assets/auth/js/validator.min.js",
            "../../../assets/auth/js/main.js"
        ];
        const STYLE_PATH_LIST = ['../../../assets/auth/css/bootstrap.min.css', '../../../assets/auth/font/flaticon.css', '../../../assets/auth/style.css'];

        Promise.all([this.scriptStyleLoaderService.loadScripts(SCRIPT_PATH_LIST), this.scriptStyleLoaderService.loadStyles(STYLE_PATH_LIST)]).then(() => {
            // All scripts and styles have finished loading
            // Call addNewClass function to add 'loaded' class
            this.addNewClass();
        }).catch(error => {
            console.error('Error loading scripts or styles:', error);
        });
    }
    addNewClass(): void {
        $('.fxt-template-animation').imagesLoaded().done(function () {
            $('.fxt-template-animation').addClass('loaded');
        });
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
    

    onImageSelected(event : any): void { // Get the selected image file
        this.selectedImage = event.target.files[0];
    }
}
