import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './resetPassword/reset-password/reset-password.component';
import { AuthComponentComponent } from './authComponent/auth-component/auth-component.component';
import { VerifcationEmailComponent } from './verifcation-email/verifcation-email.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    AuthComponentComponent,
    VerifcationEmailComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule ,
    FormsModule,
    MatSelectModule,


  ]
  
})
export class AuthModule { }
