import { Component } from '@angular/core';
import { RegisterRequest } from 'src/app/model/register-request';
import { AuthenticationResponse } from 'src/app/model/authentication-response';
import {AuthenticationService} from "../../serives/authentication.service";
import {Router} from "@angular/router";
import { VerificationRequest } from 'src/app/model/verification-request';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {};
  authResponse: AuthenticationResponse = {};
  message = '';
  otpCode = '';
  myForm: any;
  monForm!: FormGroup;
    constructor(
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder // Correct the typo in the constructor parameter
  ) {}

  ngOnInit(): void {
    // Initialize monForm using FormBuilder
    this.monForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]],
      mfaEnabled: [true, [Validators.required]]
      
    });
  }
  
  

  registerUser() {
    this.message = '';
    this.authService.register(this.monForm.value)
      .subscribe({
        next: (response) => {
          console.log("response",response);
          this.authResponse = response;
          if (response) {
            this.authResponse = response;
          } else {
            // inform the user
            this.message = 'Account created successfully\n You will be redirected to the Login page in 3 seconds';
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 3000)
          }
        }
        
      });

  }

  verifyTfa() {
    this.message = '';
    const verifyRequest: VerificationRequest = {
      email: this.monForm.value.email,
      code: this.otpCode
    };
    console.log('hello', verifyRequest);
    
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          this.message = 'Account created successfully\n You will be redirected to the Welcome page in 3 seconds';
          setTimeout(() => {
            localStorage.setItem('token', response.accessToken as string);
            this.router.navigate(['home']);
          }, 3000);
        }
      });
  }
}