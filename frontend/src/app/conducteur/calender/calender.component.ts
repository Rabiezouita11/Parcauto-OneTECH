import {Component, OnInit} from '@angular/core';
import {CalendarOptions, DateSelectArg, EventClickArg, EventApi} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {Vehicle} from 'src/app/model/Vehicle';
import {VehicleService} from 'src/app/Service/VehicleService/vehicle-service.service';
import {User} from 'src/app/model/user';
import {UserService} from 'src/app/Service/UserService/user-service.service';
import {ChangeDetectorRef} from '@angular/core';
import {Reservation} from 'src/app/model/Reservation';
import {NgForm} from '@angular/forms';
import {ReservationService} from 'src/app/Service/Reservation/reservation.service';
import Swal from 'sweetalert2';
import {EventInput} from '@fullcalendar/core';

declare var $: any;

@Component({selector: 'app-calender', templateUrl: './calender.component.html', styleUrls: ['./calender.component.scss']})
export class CalenderComponent implements OnInit {
    calendarVisible = true;
    calendarOptions : CalendarOptions = {
        plugins: [
            interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin,
        ],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',

        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        select: this.handleDateSelect.bind(this),
        eventClick: this.handleEventClick.bind(this),
        eventsSet: this.handleEvents.bind(this),
        
        events: [] // Initialize events array

    };
    pendingReservations: any[] = [];
    acceptedReservations: any[] = [];
    refusedReservations: any[] = [];
    currentEvents : EventApi[] = [];
    unavailableVehicles : Vehicle[] = [];

    conducteurUsers : User[] = [];
    selectedUser !: User;

    selectedVehicleId !: number | null;
    selectedUserId: number | null = null; // Initialize selectedUserId to null
    reservation : Reservation = {
        id: 0,
        vehicle: {
            id: 0,
            marque: '',
            modele: ''
        },
        user: {
            id: 0,
            username:''
        },
        startDate:'' ,
        endDate: '',
        mission: '',
        userIdConnected: 0,
        distiantion:'',
        accompagnateur:''
        
    };
    role : any;
    userIdConnected : any;

    constructor(private reservationService : ReservationService, private vehicleService : VehicleService, private userService : UserService, private cdr : ChangeDetectorRef) {}

    async ngOnInit() {
        await this.getInfo();
        this.loadUnavailableVehicles();
        this.loadConducteurUsers();
        this.loadReservations();
    }

    async getInfo(): Promise<void> {
        const token = localStorage.getItem('jwtToken');
    
        if (token) {
            try {
                const data: any = await this.userService.getUserInfo(token).toPromise();
                this.role = data.role;
                this.userIdConnected = data.id;
               
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        } else {
            console.error('Token not found in localStorage');
        }
    }


    getCurrentDateTime(): string {
        // Get the current date and time
        const currentDateTime: Date = new Date();
    
        // Format the date and time as required by the datetime-local input (YYYY-MM-DDTHH:MM)
        const year: number = currentDateTime.getFullYear();
        const month: number = currentDateTime.getMonth() + 1; // Month starts from 0
        const day: number = currentDateTime.getDate();
        const hours: number = currentDateTime.getHours();
        const minutes: number = currentDateTime.getMinutes();
    
        // Format the date and time as required by the datetime-local input
        const formattedDateTime: string =
            `${year}-${this.padNumber(month)}-${this.padNumber(day)}T${this.padNumber(hours)}:${this.padNumber(minutes)}`;
    
        return formattedDateTime;
    }
    
    private padNumber(num: number): string {
        return (num < 10 ? '0' : '') + num;
    }

     saveReservation(reservationForm : NgForm) { // Check if the form is invalid


        console.log(this.selectedUserId);
        if (reservationForm.invalid) { // Show error message using Swal
            Swal.fire({icon: 'error', title: 'Validation Error', text: 'Please fill out all required fields.'});
            return;
        }

        // Check if selectedVehicleId or selectedUserId is null
        if (this.selectedVehicleId === null || this.selectedUserId === null) {
            console.error('Selected vehicle ID or user ID is null');
            // Show error message using Swal
            Swal.fire({icon: 'error', title: 'Selection Error', text: 'Please select a vehicle and a user.'});
            return;
        }

        // Create the Reservation object
        const reservation: Reservation = {
            id: 0,
            vehicle: {
                id: this.selectedVehicleId,
                marque: '',
                modele: ''
            },
            user: {
                id: this.selectedUserId,
                username:''

            },
            startDate: this.reservation.startDate,
            endDate: this.reservation.endDate,
            mission: this.reservation.mission,
            userIdConnected: this.userIdConnected ,
            distiantion:this.reservation.distiantion,
            accompagnateur:this.reservation.accompagnateur,
        };
      

        // Call the reservation service to create the reservation
        this.reservationService.createReservation(reservation).subscribe(() => {
            console.log('Reservation created successfully');
            // Show success message using Swal
            Swal.fire({icon: 'success', title: 'Success', text: 'Reservation created successfully.'}).then(() => { // Reset form and close modal
                reservationForm.resetForm();
                this.closeModal();
                this.ngOnInit();
            });
        }, error => {
            console.error('Error creating reservation:', error);
            // Show error message using Swal
            Swal.fire({icon: 'error', title: 'Error', text: error.error});
        });
    }
    async loadReservations(): Promise<void> {
        if (!this.userIdConnected) {
            console.error('User ID is not available');
            return;
        }
    
        try {
            const reservations = await this.reservationService.getReservationsByUserIdConnected(this.userIdConnected).toPromise();
    
            if (reservations) {
                this.pendingReservations = reservations.filter(reservation => reservation.status === null);
                this.acceptedReservations = reservations.filter(reservation => reservation.status === true);
                this.refusedReservations = reservations.filter(reservation => reservation.status === false);
    
                // Map reservations to FullCalendar events
                const events: EventInput[] = reservations.map(reservation => ({
                    id: reservation.id.toString(),
                    title: `${reservation.vehicle.marque} - ${reservation.vehicle.modele} (${this.getReservationStatus(reservation)})`,
                    start: new Date(reservation.startDate),
                    end: new Date(reservation.endDate)
                }));
    
                // Set events to calendarOptions
                this.calendarOptions.events = events;
            } else {
                console.error('No reservations found');
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    }
    

    getReservationStatus(reservation: Reservation): string {
        if (reservation.status === null) {
          return 'En cours';
        } else if (reservation.status === false) {
          return 'Refused';
        } else {
          return 'Accepted';
        }
      }
    loadConducteurUsers() {
        this.userService.getConducteurs().subscribe(data => {
            this.conducteurUsers = data;
            console.log(" this.conducteurUsers this.conducteurUsers" + this.conducteurUsers)
        }, error => {
            console.log('Error fetching conducteur users:', error);
        });
    }

    loadUnavailableVehicles() {
        this.vehicleService.getUnavailableVehicles().subscribe(vehicles => {
            this.unavailableVehicles = vehicles;
        }, error => {
            console.error('Error fetching unavailable vehicles:', error);
        });
    }
    closeModal() {
        $('#calendarModal').modal('hide');
    }
    handleCalendarToggle() {
        this.calendarVisible = !this.calendarVisible;
    }

    handleWeekendsToggle() {
        this.calendarOptions.weekends = !this.calendarOptions.weekends;
    }

    handleDateSelect(selectInfo : DateSelectArg) { // Show the modal
        $('#calendarModal').modal('show');
    }

    handleEventClick(clickInfo : EventClickArg) {
        if (confirm(`Are you sure you want to delete the event '${
            clickInfo.event.title
        }'`)) {
            clickInfo.event.remove();
        }
    }

    handleEvents(events : EventApi[]) {
        this.currentEvents = events;
    }
   


}
