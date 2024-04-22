import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './resetPassword/reset-password/reset-password.component';
import { VerifcationEmailComponent } from './verifcation-email/verifcation-email.component';

const routes: Routes = [
  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'frogetpassword', component: ForgetPasswordComponent },
  { path: 'resetpassword', component: ResetPasswordComponent},
  { path: 'verification', component: VerifcationEmailComponent }, // Add this route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
