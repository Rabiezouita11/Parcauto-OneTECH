import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as SockJsClient from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public message: string = '';

  constructor(private http: HttpClient) {}

  // Open connection with the back-end socket
  public connect() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('JWT Token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let socket = new SockJsClient(`http://localhost:8080/socket`, undefined, {
      headers: headers // Cast options to any
    } as any);

    let stompClient = Stomp.over(socket);

    return new Promise((resolve, reject) => {
      stompClient.connect({}, (frame) => {
        // On successful connection
        console.log('Connected:', frame);

        // Subscribe to /topic/notification
        stompClient.subscribe('/topic/notification', (notification: { body: string; }) => {
          // Update message attribute with the recent message sent from the server
          this.message = notification.body;
          console.log('Received notification:', this.message);
        });

        resolve(stompClient);
      }, (error) => {
        // On error
        console.error('Connection error:', error);
        reject(error);
      });
    });
  }
}
