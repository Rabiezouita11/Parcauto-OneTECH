import {Component, OnInit} from '@angular/core';
import {CalendarOptions, DateSelectArg, EventClickArg, EventApi} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {Vehicle} from 'src/app/model/Vehicle';
import {VehicleService} from 'src/app/Service/VehicleService/vehicle-service.service';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ChangeDetectorRef } from '@angular/core';
import { Reservation } from 'src/app/model/Reservation';
import { NgForm } from '@angular/forms';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import Swal from 'sweetalert2';

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
        eventsSet: this.handleEvents.bind(this)
    };

    currentEvents : EventApi[] = [];
    unavailableVehicles : Vehicle[] = [];
 
    conducteurUsers: User[] = [];
    selectedUser!: User;

    selectedVehicleId!: number | null;
    selectedUserId!: number | null;
    reservation: Reservation = {
      vehicle: {
        id: 0
      },
      user: {
        id: 0
      },
      startDate: null,
      endDate: null,
      mission: ''
    };
  
    constructor(private reservationService: ReservationService ,private vehicleService : VehicleService,private userService: UserService , private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.loadUnavailableVehicles();
        this.loadConducteurUsers();

    }
    loadConducteurUsers() {
      this.userService.getConducteurs().subscribe(
        data => {
          this.conducteurUsers = data;
          console.log(" this.conducteurUsers this.conducteurUsers"+  this.conducteurUsers )
        },
        error => {
          console.log('Error fetching conducteur users:', error);
        }
      );
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
  saveReservation(reservationForm: NgForm) {
  // Check if the form is invalid
  if (reservationForm.invalid) {
    // Show error message using Swal
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please fill out all required fields.'
    });
    return;
  }

  // Check if selectedVehicleId or selectedUserId is null
  if (this.selectedVehicleId === null || this.selectedUserId === null) {
    console.error('Selected vehicle ID or user ID is null');
    // Show error message using Swal
    Swal.fire({
      icon: 'error',
      title: 'Selection Error',
      text: 'Please select a vehicle and a user.'
    });
    return;
  }

  // Create the Reservation object
  const reservation: Reservation = {
    vehicle: {
      id: this.selectedVehicleId
    },
    user: {
      id: this.selectedUserId
    },
    startDate: this.reservation.startDate,
    endDate: this.reservation.endDate,
    mission: this.reservation.mission
  };
  console.log(reservation);

  // Call the reservation service to create the reservation
  this.reservationService.createReservation(reservation).subscribe(
    () => {
      console.log('Reservation created successfully');
      // Show success message using Swal
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Reservation created successfully.'
      }).then(() => {
        // Reset form and close modal
        reservationForm.resetForm();
        this.closeModal();
      });
    },
    error => {
      console.error('Error creating reservation:', error);
      // Show error message using Swal
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create reservation. Please try again later.'
      });
    }
  );
}

      
}
