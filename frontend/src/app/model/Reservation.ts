export interface Reservation {
    id : number
    vehicle: {
        id: number;
        marque:string;
        modele : string ;
    };
    user: {
        id: number;
    };
    startDate: string ;
    endDate: string ;
    mission: string;
    userIdConnected:number;
    status ?:Boolean;
}
