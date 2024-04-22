import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
 
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      return this.userService.getUserInfo(token).pipe(
        map((data) => {
          const role = data.role; // Assuming the response contains a 'role' field
          const allowedRoles = ['CONDUCTEUR', 'ADMIN', 'CHEF_DEPARTEMENT'];
          const canActivate = allowedRoles.includes(role) && data.status === 'true';
          
          if (canActivate) {
          
          } else {
            if (!allowedRoles.includes(role)) {
              Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'User does not have permission to access this page'
              });
            } else if (data.status === 'false') {
              Swal.fire({
                icon: 'error',
                title: 'Account Disabled',
                text: 'Your account is disabled'
              });
            } else if (data.status === 'null') {
              Swal.fire({
                icon: 'info',
                title: 'Account Status',
                text: 'Your account is currently under review. You will be notified via email once it is processed.'
              });
            }
            this.router.navigate(['/auth/login']); // Redirect to login page
          }
          
          return canActivate;
        }),
        catchError((error) => {
          console.error('Error fetching user information:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching user information'
          });
          this.router.navigate(['/auth/login']); // Redirect to login page
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/auth/login']); // Redirect to login page if token is not available
      return of(false);
    }
  }
}
