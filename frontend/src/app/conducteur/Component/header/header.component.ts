import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { WebSocketService } from 'src/app/Service/WebSocket/web-socket.service';
import { ScriptStyleLoaderService } from 'src/app/Service/script-style-loader/script-style-loader.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    isScrolled = false;
    @HostListener('window:scroll', [])
    onWindowScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.isScrolled = scrollPosition > 0; // Set isScrolled to true if the page is scrolled
    }
    notificationCount: number = 0;
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

    constructor(private webSocketService: WebSocketService, private renderer: Renderer2, private sanitizer: DomSanitizer, private http: HttpClient, private router: Router, private scriptStyleLoaderService: ScriptStyleLoaderService, private userService: UserService) {
        this.token = localStorage.getItem('jwtToken');

    }
    ngOnInit(): void {
        this.webSocketService.connect().then(() => {
          // Subscribe to notifications
          this.notificationSubscription = this.webSocketService.getNotificationObservable().subscribe(notification => {
            // Handle notification update
            console.log('Notification received:', notification);
            this.notificationCount++;
            this.notifications.unshift(notification); // Add new notification to the top of the list
            this.getImageUrlNotifications(notification.userId, notification.chefDepartementPhoto);

          });
        }).catch(error => {
          console.error('WebSocket connection error:', error);
        });
      
        // Fetch existing notifications from the backend
        this.webSocketService.fetchNotifications().subscribe((notifications: any[]) => {
          this.notifications = notifications;
          console.log( 'aaaaaaaaa',this.notifications )
          this.notificationCount = notifications.length;
          notifications.forEach(notification => {
            this.getImageUrlNotifications(notification.userId, notification.fileName
            );
          });
        }, error => {
          console.error('Error fetching notifications:', error);
        });
      
        this.getUserFirstName();
      }
      
    ngOnDestroy() {
        // Clean up subscriptions
        if (this.notificationSubscription) {
          this.notificationSubscription.unsubscribe();
        }
        this.webSocketService.disconnect();
      }
    public showNotifications() {
        this.showNotificationList = true;
    }

    // Hide notification list on mouse leave
    public hideNotifications() {
        this.showNotificationList = false;
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

            }, (error) => {
                console.error('Error fetching user information:', error);
            });
        } else {
            console.error('Token not found in localStorage');
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
    
}
