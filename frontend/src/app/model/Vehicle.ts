export interface Vehicle {
    id: number;
    marque: string;
    matricule: string;
    modele: string;
    annee?: number;
    numeroSerie: string;
    kilometrage: number;
    disponibilite: boolean;
}
