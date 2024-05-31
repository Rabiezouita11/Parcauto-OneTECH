import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Carburant } from 'src/app/model/Carburant';
import { Reservation } from 'src/app/model/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ConducteurService {

  private baseUrl = 'http://localhost:8080/conducteur';

  constructor(private http: HttpClient) { }

  getReservationsByUserId(userId: number): Observable<Reservation[]> {
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    if (!token) {
      return throwError('Token is not available');
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations/${userId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }

  saveCarburant(carburant: Carburant): Observable<Carburant> {
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    if (!token) {
      return throwError('Token is not available');
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post<any>(`${this.baseUrl}/save`, carburant, { headers })
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }
}
