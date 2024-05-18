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

  private getHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    if (!token) {
      return null;
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

    // Method to fetch all reservations
    getAllReservations(): Observable<Reservation[]> {
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      if (!token) {
        return throwError('Token is not available'); // Throw an error if token is not available
      }
    
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      
      return this.http.get<Reservation[]>(`${this.ChefDepartementUrl}/reservations`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching reservations', error);
          return throwError(error);
        })
      );
    }
    
    updateReservationStatus(id: number, status: boolean): Observable<Reservation> {
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      if (!token) {
        return throwError('Token is not available'); // Throw an error if token is not available
      }
    
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      
      return this.http.put<Reservation>(`${this.ChefDepartementUrl}/updateReservationStatus/${id}`, status, { headers }).pipe(
        catchError(error => {
          console.error('Error updating reservation status', error);
          return throwError(error);
        })
      );
    }
    
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
  getUsernameById(userId: number): Observable<{ username: string }> {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return throwError('Token is not available');
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<{ username: string }>(`${this.ChefDepartementUrl}/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching username by ID:', error);
        return throwError(error);
      })
    );
  }
  
  
}
