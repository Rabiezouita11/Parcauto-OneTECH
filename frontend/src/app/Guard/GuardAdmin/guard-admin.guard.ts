import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserService } from 'src/app/Service/UserService/user-service.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GuardAdminGuard implements CanActivate {

  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const token = localStorage.getItem('jwtToken');

    if (token) {
      return this.userService.getUserInfo(token).pipe(
        map((data) => {
          const role = data.role; // Assuming the response contains a 'role' field
          const canActivate = role === 'ADMIN';
          
          if (!canActivate) {
            Swal.fire({
              icon: 'error',
              title: 'Access Denied',
              text: 'You do not have permission to access this page',
              confirmButtonText: 'OK'
            }).then(() => {
              window.location.reload(); // Reload the page after navigation
            });
          }
          
          return canActivate;
        })
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please login to access this page',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/auth/login']); // Redirect to login page if token is not available
      });
      return false;
    }
  }
}
