import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Vehicle } from 'src/app/model/Vehicle';
import { VehicleService } from 'src/app/Service/VehicleService/vehicle-service.service';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/Service/UserService/user-service.service';
import { ChangeDetectorRef } from '@angular/core';
import { Reservation } from 'src/app/model/Reservation';
import { NgForm } from '@angular/forms';
import { ReservationService } from 'src/app/Service/Reservation/reservation.service';
import Swal from 'sweetalert2';
import { EventInput } from '@fullcalendar/core';

declare var $: any;

@Component({ selector: 'app-calender', templateUrl: './calender.component.html', styleUrls: ['./calender.component.scss'] })
export class CalenderComponent implements OnInit {
    calendarVisible = true;
    calendarOptions: CalendarOptions = {
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

        events: [], // Initialize events array
        // validRange: {
        //     start: new Date().toISOString().split('T')[0] // Set the start date to today
        // }
    };
    pendingReservations: any[] = [];
    acceptedReservations: any[] = [];
    refusedReservations: any[] = [];
    currentEvents: EventApi[] = [];
    unavailableVehicles: Vehicle[] = [];

    conducteurUsers: User[] = [];
    selectedUser !: User;

    selectedVehicleId: number | null = null; // or selectedVehicleId: string = '';
    selectedUserId: number | null = null; // Initialize selectedUserId to null
    reservation: Reservation = {
        id: 0,
        vehicle: {
            id: 0,
            marque: '',
            modele: ''
        },
        user: {
            id: 0,
            username: ''
        },
        startDate: '',
        endDate: '',
        mission: '',
        userIdConnected: 0,
        distiantion: '',
        accompagnateur: '',
        montant: 0

    };
    role: any;
    userIdConnected: any;

    constructor(private reservationService: ReservationService, private vehicleService: VehicleService, private userService: UserService, private cdr: ChangeDetectorRef) { }

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
    getCurrentDate(): string {
        // Get the current date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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

    saveReservation(formReservation: NgForm) { // Vérifier si le formulaire est invalide
        console.log(this.selectedUserId);
        if (formReservation.invalid) { // Afficher un message d'erreur en utilisant Swal
            Swal.fire({ icon: 'error', title: 'Erreur de validation', text: 'Veuillez remplir tous les champs obligatoires.' });
            return;
        }

        // Vérifier si selectedVehicleId ou selectedUserId est nul
        if (this.selectedVehicleId === null || this.selectedUserId === null) {
            console.error('L\'identifiant du véhicule sélectionné ou l\'identifiant de l\'utilisateur est nul');
            // Afficher un message d'erreur en utilisant Swal
            Swal.fire({ icon: 'error', title: 'Erreur de sélection', text: 'Veuillez sélectionner un véhicule et un utilisateur.' });
            return;
        }

        // Créer l'objet Réservation
        const reservation: Reservation = {
            id: 0,
            vehicle: {
                id: this.selectedVehicleId,
                marque: '',
                modele: ''
            },
            user: {
                id: this.selectedUserId,
                username: ''
            },
            montant: 0,
            startDate: this.reservation.startDate,
            endDate: this.reservation.endDate,
            mission: this.reservation.mission,
            userIdConnected: this.userIdConnected,
            distiantion: this.reservation.distiantion,
            accompagnateur: this.reservation.accompagnateur,
        };

        // Appeler le service de réservation pour créer la réservation
        this.reservationService.createReservation(reservation).subscribe(() => {
            console.log('Réservation créée avec succès');
            // Afficher un message de succès en utilisant Swal
            Swal.fire({ icon: 'success', title: 'Succès', text: 'Réservation créée avec succès.' }).then(() => { // Réinitialiser le formulaire et fermer la fenêtre modale
                formReservation.resetForm();
                this.closeModal();
                this.ngOnInit();
            });
        }, error => {
            console.error('Erreur lors de la création de la réservation :', error);
            // Afficher un message d'erreur en utilisant Swal
            Swal.fire({ icon: 'error', title: 'Erreur', text: error.error });
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

        console.log(reservation.statusReservation)
        if (reservation.status === null) {
            return 'En cours';
        } else if (reservation.status === true && reservation.statusReservation === true) {
            return 'Acceptée et Terminée';
        } else if (reservation.status === true && reservation.statusReservation === null) {
            return 'Acceptée';
        } else if (reservation.status === false && reservation.statusReservation === null) {
            return 'Refusée';
        } else {
            return 'Statut inconnu';
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

    handleDateSelect(selectInfo: DateSelectArg) { // Show the modal
        $('#calendarModal').modal('show');
    }



    handleEventClick(clickInfo: EventClickArg) {
        const eventStatus = this.getReservationStatusFromEvent(clickInfo.event);
        if (eventStatus === 'Acceptée') {
            const eventTitle = clickInfo.event.title;
            Swal.fire({
                title: `Êtes-vous sûr de terminer la réservation "${eventTitle}" ?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Annuler',
            }).then((result) => {
                if (result.isConfirmed) {
                    const reservationId = clickInfo.event.id; // Assuming the ID is stored in the event object
                    const id: number = parseInt(reservationId, 10);

                    this.updateReservationStatus(id);

                    console.log(`Reservation "${reservationId}" finished.`);
                }
            });
        }
    }
    updateReservationStatus(reservationId: number) {
        this.reservationService.updateReservationStatusifstatusTrue(reservationId, true).subscribe(
            (response) => {
                console.log('Reservation status updated successfully');
                Swal.fire('Succès', 'La réservation a été terminée avec succès', 'success');
                this.ngOnInit();
            },
            (error) => {
                console.error('Error updating reservation status:', error);
                Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour du statut de la réservation', 'error');

            }
        );
    }
    getReservationStatusFromEvent(event: EventApi): string {
        // Extract status from event title
        const eventTitleParts = event.title.split('(');
        if (eventTitleParts.length > 1) {
            return eventTitleParts[1].split(')')[0].trim();
        }
        return '';
    }


    handleEvents(events: EventApi[]) {
        this.currentEvents = events;
    }



}
