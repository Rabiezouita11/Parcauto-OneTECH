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
    constructor(private vehicleService : VehicleService,private userService: UserService , private cdr: ChangeDetectorRef) {}

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
}
