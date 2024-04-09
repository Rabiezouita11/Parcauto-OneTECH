// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }
  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user).pipe(
      tap(response => {
        console.log(response);
        // Save JWT token to local storage upon successful login
        if (response && response.token) {
          localStorage.setItem('jwtToken', response.token);
        }
  
      })
    );
  }
  getUserInfo(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}/user`, { headers });
  }

  forgetPassword(email :string) {
 
    return this.http.get(`http://localhost:8080/users/verif/${email}`);
   } 

   resetPassword(token : string, pwd : string) {
  
    return this.http.get(`http://localhost:8080/users/rest/${token}/${pwd}`);
   }  
  }
  
 

