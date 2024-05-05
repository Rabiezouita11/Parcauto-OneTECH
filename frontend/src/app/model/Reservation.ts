export interface Reservation {
    vehicle: {
        id: number;
    };
    user: {
        id: number;
    };
    startDate: string | null;
    endDate: string | null;
    mission: string;
}
