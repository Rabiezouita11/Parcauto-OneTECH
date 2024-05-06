import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Reservation } from 'src/app/model/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private ChefDepartementUrl = 'http://localhost:8080/ChefDepartement';

  constructor(private http: HttpClient) { }
  createReservation(reservation: Reservation): Observable<Reservation> {
    const token = localStorage.getItem('jwtToken');
    console.log(token)
    if (!token) {
      return throwError('Token is not available'); // Throw an error if token is not available
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post<Reservation>(`${this.ChefDepartementUrl}/createReservation`, reservation, { headers })
      .pipe(
        catchError(error => {
          return throwError(error); // Throw an error if request fails
        })
      );
  }
  
  getReservationsByUserIdConnected(userIdConnected: number): Observable<Reservation[]> {
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    if (!token) {
      return throwError('Token is not available'); // Throw an error if token is not available
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<Reservation[]>(`${this.ChefDepartementUrl}/reservationsByUserIdConnected/${userIdConnected}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching reservations:', error);
          return throwError('Error fetching reservations. Please try again later.');
        })
      );
  }
}
