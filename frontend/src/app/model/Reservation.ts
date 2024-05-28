export interface Reservation {
    id: number;
    vehicle: {
        id: number;
        marque: string;
        modele: string;
    };
    user: {
        id: number;
        username: string;
    };
    startDate: string;
    endDate: string;
    mission: string;
    userIdConnected: number;
    status?: boolean;
    connectedUserName?: {
        username: string;
    }; // Define connectedUserName as an object with a username property
    distiantion: string;
    accompagnateur: string;
    montant: number; // New attribute
    statusReservation?:boolean
}
