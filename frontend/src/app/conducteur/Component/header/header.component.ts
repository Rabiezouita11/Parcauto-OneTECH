import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { WebSocketService } from 'src/app/Service/WebSocket/web-socket.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';
import Swal from 'sweetalert2'; // Import SweetAlert
import { Howl } from 'howler';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import { Reservation } from 'src/app/model/Reservation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  notificationSound!: Howl;
  hasNewNotification: boolean = false;
  reservations: Reservation[] = [];

  isScrolled = false;
  userNotifications!: any[];
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 0; // Set isScrolled to true if the page is scrolled
  }
  notificationCount: number = 0;
  notificationCountuser: number = 0;
  notifications: any[] = [];
  showNotificationList: boolean = false;
  notificationSubscription: Subscription | undefined;
  userId: any;
  fileName: any;
  token: string | null;
  imageUrl: string | undefined | null;
  firstName: any;
  lastName: any;
  email: any;
  role: any;
  mouseLeaveTimeout: any; // Variable to hold the timeout reference

  constructor(private reservationService: ReservationService, private webSocketService: WebSocketService, private renderer: Renderer2, private sanitizer: DomSanitizer, private http: HttpClient, private router: Router, private scriptStyleLoaderService: ScriptStyleLoaderService, private userService: UserService) {
    this.token = localStorage.getItem('jwtToken');

  }
  ngOnInit(): void {
    this.notificationSound = new Howl({
      src: ['assets/infographic-app-notification-bell-betacut-1-00-02.mp3']
    });

    this.getUserFirstName();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.notificationSubscription) {
        this.notificationSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();

    // Stop and unload notification sound
    if (this.notificationSound) {
        this.notificationSound.unload();
    }
}

  showNotifications(): void {
    clearTimeout(this.mouseLeaveTimeout); // Clear the timeout if it's already set
    this.showNotificationList = true;
  }

  hideNotifications(): void {
    // Delay hiding the notification list by 200 milliseconds
    this.mouseLeaveTimeout = setTimeout(() => {
      this.showNotificationList = false;
    }, 200);
  }
  getUserFirstName(): void {

    if (this.token) {
      this.userService.getUserInfo(this.token).subscribe((data) => { // Assuming the response contains the user information in JSON format
        this.userId = data.id;
        this.fileName = data.image;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.role = data.role;

        this.getImageUrl(); // Call getImageUrl after getting user info
        this.initializeWebSocketConnection(); // Initialize WebSocket connection based on role

      }, (error) => {
        console.error('Error fetching user information:', error);
      });
    } else {
      console.error('Token not found in localStorage');
    }
  }
  initializeWebSocketConnection(): void {
    if (this.role === 'ADMIN') {
      this.webSocketService.connect().then(() => {
       
        // Subscribe to notifications for admin
        this.notificationSubscription = this.webSocketService.getNotificationObservable().subscribe(notification => {
          this.notificationSound.play();
          console.log('Notification received:', notification);
          notification.timestamp = new Date();
      

        
        
      
    
          // Add new notification to the ADMIN notifications list
          this.notifications.unshift(notification);
          this.notificationCount++;
          this.getImageUrlNotifications(notification.userId, notification.chefDepartementPhoto);
        });
      }).catch(error => {
        console.error('WebSocket connection error:', error);
      });

      // Fetch existing notifications from the backend
      this.webSocketService.fetchNotifications().subscribe((notifications: any[]) => {
        this.notifications = notifications; // Update ADMIN notifications
        this.notificationCount = notifications.length;
        notifications.forEach(notification => {
          this.getImageUrlNotifications(notification.userId, notification.fileName);
        });
      }, error => {
        console.error('Error fetching notifications:', error);
      });

    } else if (this.role === 'CHEF_DEPARTEMENT' || this.role === 'CONDUCTEUR') {
      this.webSocketService.getNotificationsForUser(this.userId).subscribe((notifications: any[]) => {
        this.userNotifications = notifications; // Update CHEF_DEPARTEMENT notifications
        this.hasNewNotification = true; // Set flag to true when a new notification arrives

        console.log(this.userNotifications)
        this.notificationCountuser = notifications.length;
        notifications.forEach(notification => {
          console.log(notification.userId, notification.fileName)
          this.getImageUrlNotificationsUser(notification.userId, notification.fileName);
        });
      }, error => {
        console.error('Error fetching user-specific notifications:', error);
      });

      let stompClient = this.webSocketService.connectToUser();
      stompClient.connect({}, (frame: any) => {
        console.log('Connected to WebSocket:', frame);

        // Subscribe to the user-specific queue
        stompClient.subscribe(`/user/${this.userId}/queue/notification`, (message: { body: string; }) => {
          let data = JSON.parse(message.body);
          console.log('Received a message for CHEF_DEPARTEMENT:', data);
          this.notificationSound.play();
          // Ensure userNotifications array is initialized before pushing data
          if (this.userNotifications) {

            this.userNotifications.unshift({ // Add new notification to CHEF_DEPARTEMENT notifications
              userId: data.userId,
              fileName: data.fileName,
              message: data.message,
              username: data.username,
              id: data.id,
              timestamp: new Date(data.timestamp) // Assuming data.timestamp is a string or number
            });
            this.notificationCountuser++;
          } else {
            console.error('userNotifications array is not initialized.');
          }
        }, (error: any) => {
          console.error('Subscription error:', error);
        });
      }, (error: any) => {
        console.error('Connection error:', error);
      });
    }
  }




  getImageUrl(): void {
    if (!this.fileName) { // Set imageUrl to null or provide a default image URL
      this.imageUrl = null; // or provide a default image URL: this.imageUrl = 'path/to/default/image.jpg';
      return; // Exit the method early
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token
        }`
    });

    // Assuming your backend endpoint for retrieving images is '/api/images/'
    this.http.get(`http://localhost:8080/images/${this.userId
      }/${this.fileName
      }`, { headers, responseType: 'blob' }).subscribe((response: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(response);
      }, (error) => {
        console.error('Error fetching image:', error);
      });
  }
  logout(): void {
    // Remove the JWT token from local storage
    localStorage.removeItem('jwtToken');

    // Redirect the user to the login page after a delay
    window.location.reload();

  }
  generateAvatarSrc(firstName: string, lastName: string): SafeResourceUrl {
    try {
      const initials = `${firstName.charAt(0).toUpperCase()
        }${lastName.charAt(0).toUpperCase()
        }`;
      const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'><text x='50' y='50' text-anchor='middle' alignment-baseline='central' font-size='40' fill='black'>${initials}</text></svg>`;
      const safeSvg = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString));
      return safeSvg;
    } catch (error) {
      console.error('Error generating avatar source:', error);
      return '';
    }
  }
  generateAvatarSrcBlanc(firstName: string, lastName: string): SafeResourceUrl {
    try {
      const initials = `${firstName.charAt(0).toUpperCase()
        }${lastName.charAt(0).toUpperCase()
        }`;
      const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'><text x='50' y='50' text-anchor='middle' alignment-baseline='central' font-size='40' fill='white'>${initials}</text></svg>`;
      const safeSvg = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString));
      return safeSvg;
    } catch (error) {
      console.error('Error generating avatar source:', error);
      return '';
    }
  }
  getImageUrlNotificationsUser(userId: number, fileName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!fileName) {
        resolve(); // No image to fetch, resolve immediately
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.get(`http://localhost:8080/images/${userId}/${fileName}`, { headers, responseType: 'blob' }).subscribe((response: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          this.updateNotificationImage(userId, imageUrl);
        };
        reader.readAsDataURL(response);
      }, (error) => {
        console.error('Error fetching image:', error);
        reject(error); // Reject promise on error
      });
    });
  }
  getImageUrlNotifications(userId: number, fileName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!fileName) {
        resolve(); // No image to fetch, resolve immediately
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.get(`http://localhost:8080/images/${userId}/${fileName}`, { headers, responseType: 'blob' }).subscribe((response: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          this.updateNotificationImage(userId, imageUrl);
        };
        reader.readAsDataURL(response);
      }, (error) => {
        console.error('Error fetching image:', error);
        reject(error); // Reject promise on error
      });
    });
  }

  updateNotificationImage(userId: number, imageUrl: string): void {
    for (let notification of this.notifications) {
      if (notification.userId === userId) {
        notification.imageUrl = imageUrl;
      }
    }
  }
  // Assuming this method is responsible for formatting the timestamp
  formatTimestamp(timestamp: Date | undefined): string {
    if (!timestamp) {
      return ''; // Handle case where timestamp is undefined or null
    }

    if (!(timestamp instanceof Date)) {
      console.error('Invalid timestamp:', timestamp);
      return ''; // Handle case where timestamp is not a Date object
    }

    // Format the timestamp as needed
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    const seconds = timestamp.getSeconds().toString().padStart(2, '0');
    const day = timestamp.getDate().toString().padStart(2, '0');
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = timestamp.getFullYear();

    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
  }
  deleteNotification(notificationId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      text: 'Vous ne pourrez pas récupérer cette notification !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.webSocketService.deleteNotification(notificationId).subscribe(
          () => {
            if (this.role === 'ADMIN') {
              this.notifications = this.notifications.filter(notification => notification.id !== notificationId);
              this.notificationCount = this.notifications.length;
            } else if (this.role === 'CHEF_DEPARTEMENT' || this.role === 'CONDUCTEUR') {
              this.userNotifications = this.userNotifications.filter(notification => notification.id !== notificationId);
              this.notificationCountuser = this.userNotifications.length;
            }
            Swal.fire('Supprimé !', 'La notification a été supprimée.', 'success');
          },
          error => {
            console.error('Erreur lors de la suppression de la notification :', error);
            Swal.fire('Erreur', 'Échec de la suppression de la notification !', 'error');
          }
        );
      }
    });
  }
  markNotificationsAsRead(): void {
    // Perform logic to mark notifications as read
  
    // Example: Simulating marking notifications as read
    // Replace this with your actual logic to mark notifications as read
    console.log('Notifications marked as read');
    
    // Reset the flag to indicate no new notifications
    this.hasNewNotification = false;
  }
  getAllReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      data => {
        this.reservations = data;
        this.populateConnectedUserNames();
      },
      error => console.error('Error fetching reservations', error)
    );
  }
  populateConnectedUserNames(): void {
    for (const reservation of this.reservations) {
      if (reservation.userIdConnected) {
        this.reservationService.getUsernameById(reservation.userIdConnected).subscribe(
          username => reservation.connectedUserName = username,
          error => console.error('Error fetching user details', error)
        );
      }
    }
  }
}
