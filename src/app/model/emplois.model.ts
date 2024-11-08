import { classe } from "./classe.model";
import { formateur } from "./formateur.model";
import { salle } from "./salle.model";

export class emplois
{
    id! : number ;
    date_jour! : Date;
    debut! :number;
    fin! : number;
    idsl! : salle;
    idcl! : classe;
    idform! : formateur;
    nombreHeures: number = 0; 
    calculateNombreHeures(): void {
        this.nombreHeures = this.fin - this.debut;
    }

    coutParHeure: number = 0;
    totalPrix: number = 0;
    calculateTotal(): void {
      this.totalPrix = this.nombreHeures * this.coutParHeure;
    }

    checkboxChecked: boolean ;
    updatePrixTotal: () => void;
    constructor() {
      this.updatePrixTotal = () => {};
    }
}