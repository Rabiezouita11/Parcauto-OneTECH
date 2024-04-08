import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from 'src/app/Service/UserService/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConducteurGuard implements CanActivate {
 
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      return this.userService.getUserInfo(token).pipe(
        map((data) => {
          const isAdmin = data.role === 'CONDUCTEUR'; // Assuming the response contains a 'role' field
          if (isAdmin) {
            return true;
          } else {
            return false;
          }
        }),
        catchError((error) => {
          console.error('Error fetching user information:', error);
          this.router.navigate(['/auth/login']); // Redirect to login page if there's an error
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/auth/login']); // Redirect to login page if token is not available
      return of(false);
    }
  }
}

