import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as SockJsClient from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Subject, Observable } from 'rxjs';
import * as SockJs from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private stompClient: Stomp.Client | undefined;
  private notificationSubject: Subject<any> = new Subject<any>();
  private connected: boolean = false;
  private readonly socketUrl: string = 'http://localhost:8080/socket';
  private readonly apiUrl: string = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  // Open connection with the back-end socket
  public connect(): Promise<void> {
    
    if (this.connected) {
      return Promise.resolve();
    }
    

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('JWT Token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let socket = new SockJsClient(this.socketUrl, undefined, { headers } as any);

    this.stompClient = Stomp.over(socket);

    return new Promise<void>((resolve, reject) => {
      this.stompClient!.connect({}, (frame) => {
        // On successful connection
        console.log('Connected:', frame);
        this.connected = true;

        // Subscribe to /topic/notification
        this.stompClient!.subscribe('/topic/notification', (notification: { body: string; }) => {
          // Update message attribute with the recent message sent from the server
          console.log('Received notification:', notification.body);
          this.notificationSubject.next(JSON.parse(notification.body));
        });

        resolve();
      }, (error) => {
        // On error
        console.error('Connection error:', error);
        reject(error);
      });
    });
  }

  public connectToUser() {
    let socket = new SockJs(`http://localhost:8080/socket`);

    let stompClient = Stomp.over(socket);

    return stompClient;
}
  // Method to get notifications as an observable
  public getNotificationObservable(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  // Fetch all notifications from the backend
  public fetchNotifications(): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('JWT Token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Disconnect WebSocket connection
  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
        this.connected = false;
      });
    }
  }

  public getNotificationsForUser(userId: number): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('JWT Token is not available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/${userId}`, { headers });
  }
}
