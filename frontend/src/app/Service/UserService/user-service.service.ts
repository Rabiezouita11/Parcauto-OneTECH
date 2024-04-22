// user.service.ts
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {User} from 'src/app/model/user';

import Swal from 'sweetalert2';

@Injectable({providedIn: 'root'})
export class UserService {

    private baseUrl = 'http://localhost:8080';
    private UserUrl = 'http://localhost:8080/user';

    constructor(private http : HttpClient) {}

    register(user : any): Observable < any > {
        return this.http.post<any>(`${
            this.baseUrl
        }/register`, user);
    }
    login(user : any): Observable < any > {
        return this.http.post<any>(`${
            this.baseUrl
        }/login`, user).pipe(tap(response => { // Save JWT token to local storage upon successful login
            if (response && response.token) {
                localStorage.setItem('jwtToken', response.token);
            }

        }));
    }
    getUserInfo(token : string): Observable < any > {
        const headers = new HttpHeaders(
            {'Authorization': `Bearer ${token}`}
        );

        return this.http.get<any>(`${
            this.baseUrl
        }/user`, {headers});
    }

    forgetPassword(email : string) {

        return this.http.get(`http://localhost:8080/users/verif/${email}`);
    }

    resetPassword(token : string, pwd : string) {

        return this.http.get(`http://localhost:8080/users/rest/${token}/${pwd}`);
    }

    updateProfile(profileData : any, token : string): Observable < any > {
        const headers = new HttpHeaders(
            {'Authorization': `Bearer ${token}`}
        );

        return this.http.post<any>(`http://localhost:8080/user/profile/update`, profileData, {headers});
    }

    getConducteursAndChefs(): Observable < User[] > {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Token Error',
                text: 'Token is not available',
                confirmButtonText: 'OK'
            });        }
        const headers = new HttpHeaders(
            {'Authorization': `Bearer ${token}`}
        );
        return this.http.get<User[]>(`http://localhost:8080/admin/users`, {headers});
    }
    updateUserStatus(userId: number, status: boolean): Observable<any> {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Token Error',
            text: 'Token is not available',
            confirmButtonText: 'OK'
          });
        }
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        return this.http.put(`${this.baseUrl}/admin/users/${userId}/status?status=${status}`, null, { headers: headers });
      }

      showConfirmationDialogAccepter(userFullName: string, acceptCallback: Function, rejectCallback: Function) {
        Swal.fire({
          title: 'Confirmation',
          text: `Êtes-vous sûr d'accepter ${userFullName} ?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Accepter',
          cancelButtonText: 'Annuler'
        }).then((result) => {
          if (result.isConfirmed) {
            acceptCallback();
          } else {
            rejectCallback();
          }
        });
      }
      showConfirmationDialogRefuser(userFullName: string, acceptCallback: Function, rejectCallback: Function) {
        Swal.fire({
          title: 'Confirmation',
          text: `Êtes-vous sûr de refuser ${userFullName} ?`, // Changed message here
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Accepter',
          cancelButtonText: 'Annuler'
        }).then((result) => {
          if (result.isConfirmed) {
            acceptCallback();
          } else {
            rejectCallback();
          }
        });
      }
      changeUserRole(userId: number, newRole: string): Observable<any> {
        const token = localStorage.getItem('jwtToken');
    
        // Check if token exists
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Token Error',
            text: 'Token is not available',
            confirmButtonText: 'OK'
          });
          return throwError('Token is not available');
        }
    
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        const params = new HttpParams()
          .set('userId', userId.toString())
          .set('newRole', newRole);
    
        return this.http.post<any>('http://localhost:8080/user/role/change', {}, { headers, params })
          .pipe(
            catchError(error => {
              console.error('Error changing user role:', error);
              return throwError(error);
            })
          );
      }

}
