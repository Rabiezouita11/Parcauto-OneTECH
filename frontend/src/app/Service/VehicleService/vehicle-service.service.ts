import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehicle } from 'src/app/model/Vehicle';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
  export class VehicleService {
    private baseUrl = 'http://localhost:8080/admin';
  
    constructor(private http: HttpClient) {}
  
    getAllVehicles(): Observable<Vehicle[]> {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        return throwError('Token is not available'); // Throw an error if token is not available
      }
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching vehicles:', error);
          return throwError('Error fetching vehicles');
        })
      );
    }
  
    createVehicle(vehicle: Vehicle): Observable<Vehicle> {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        return throwError('Token is not available'); // Throw an error if token is not available
      }
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.post<Vehicle>(`${this.baseUrl}/vehicles`, vehicle, { headers }).pipe(
        catchError(error => {
          console.error('Error creating vehicle:', error);
          return throwError('Error creating vehicle');
        })
      );
    }
  
    updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        return throwError('Token is not available'); // Throw an error if token is not available
      }
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${this.baseUrl}/vehicles/${id}`;
      return this.http.put<Vehicle>(url, vehicle, { headers }).pipe(
        catchError(error => {
          console.error('Error updating vehicle:', error);
          return throwError('Error updating vehicle');
        })
      );
    }
  
    deleteVehicle(id: number): Observable<any> {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        return throwError('Token is not available'); // Throw an error if token is not available
      }
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${this.baseUrl}/vehicles/${id}`;
      return this.http.delete(url, { headers }).pipe(
        catchError(error => {
          console.error('Error deleting vehicle:', error);
          return throwError('Error deleting vehicle');
        })
      );
    }
}