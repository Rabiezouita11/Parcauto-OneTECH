import { Component } from '@angular/core';
import { AuthenticationRequest } from 'src/app/model/authentication-request';
import { AuthenticationResponse } from 'src/app/model/authentication-response';
import {AuthenticationService} from "../../serives/authentication.service";
import {Router} from "@angular/router";
import { VerificationRequest } from 'src/app/model/verification-request';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {};
  otpCode = '';
  authResponse: AuthenticationResponse = {};
  monForm: any;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder 
  ) {
  }
  ngOnInit(): void {
    // Initialize monForm using FormBuilder
    this.monForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
     
    });
  }

  authenticate() {
    this.authService.login(this.monForm.value)
      .subscribe({
        next: (response) => {
          this.authResponse = response;
          if (!this.authResponse.mfaEnabled) {
            localStorage.setItem('token', response.accessToken as string);
            this.router.navigate(['home']);
          }
        }
      });
  }

  verifyCode() {
    const verifyRequest: VerificationRequest = {
      email: this.monForm.value.email,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.accessToken as string);
          this.router.navigate(['home']);
        }
      });
  }
}
