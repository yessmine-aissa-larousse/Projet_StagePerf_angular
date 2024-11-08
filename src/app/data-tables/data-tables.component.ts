import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDatepicker , NgbDateStruct , NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormateurService } from 'app/services/formateur.service';
import { formateur } from 'app/model/formateur.model';
import { emplois } from 'app/model/emplois.model';

@Component({
  selector: 'app-datatables',
  templateUrl: './data-tables.component.html',
  styleUrls: ['./data-tables.component.scss', '../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DataTablesComponent implements OnInit, AfterViewInit {

  form!: FormGroup;
  formateurs: formateur[];
  tab_form: emplois[];
  Idslected: number;
  

  @ViewChild(NgbDatepicker, { static: false }) datepicker!: NgbDatepicker;

  constructor(private fb: FormBuilder, private formateurService: FormateurService) { }

  ngAfterViewInit() {
    if (this.datepicker) {
      this.form.updateValueAndValidity();
    }
  }

  

  ngOnInit() {
    //objet de date actuelle 
    const now = new Date();
    //date de début de semaine
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate());
    //date de fin de semaine 
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + (6 -startOfWeek.getDay()));
    
    this.form = this.fb.group({
      debutSemaine: [{ year: startOfWeek.getFullYear(), month: startOfWeek.getMonth() + 1, day: startOfWeek.getDate() }, Validators.required ],
      finSemaine: [{ year: endOfWeek.getFullYear(), month: endOfWeek.getMonth() + 1, day: endOfWeek.getDate() }, Validators.required ],
      selectedFormateur: ['', Validators.required]
    });

    
    //cette partie permet de filtrer  ou rechercher un formateur 
    this.formateurService.getformateurs().subscribe(
      (data) => {
        this.formateurs = data.map((formateur) => ({
          ...formateur,
          fullName: `${formateur.nom} ${formateur.prenom}`
        }));
        console.log('Après appel service (formateurs):', this.formateurs);
      },
      (error) => {
        console.error('Error getting formateurs', error);
      }
    );
  }

  //retourner le nom selectionner
  NameSelected(Formateur: formateur) {
    this.Idslected = Formateur ? Formateur.id : undefined;

    if (this.Idslected !== undefined) {
      this.displayEmploisFormateur();
    }
  }
  //une méthode pour vérifier si il ya un formateur il va afficher les donner dans le table 
  displayEmploisFormateur() {
    if (this.Idslected !== undefined) {
      this.submit();
    }
  }
  //préparation des colonnes de data-table
  public columns = [
    { name: 'Date', prop: 'date_jour', width: 50 },
    { name: 'Classe', prop: 'idcl', width: 50 },
    { name: 'Salle', prop: 'idsl', width: 50 },
    { name: 'Nombre Heures', prop: 'nombreHeures', width: 50 },
    { name: 'coût(H)', prop: 'coutParHeure', width: 50 },
    { name: 'Totale', prop: 'totalPrix', width: 50 },
    { name: 'Gest_Abs', prop: 'checkboxChecked', width: 50 },
  ];
  
  
  
  
  public ColumnMode = ColumnMode;
  prixTotal: number = 0;
  //méthode pour remplir le tab selon le formateur selectionner 
  submit() {
  const debutSemaineString = this.formatNgbDate(this.form.value.debutSemaine);
  const finSemaineString = this.formatNgbDate(this.form.value.finSemaine);

  console.log('Debut semaine:', debutSemaineString);
  console.log('Fin semaine:', finSemaineString);

  this.formateurService.getEmploisFormateur(this.Idslected, debutSemaineString, finSemaineString).subscribe(
    (data) => {
      console.log('Données retournées par le service :', data);
            
            // Convertir les objets retournés en instances de la classe emplois 
            this.tab_form = data.map(item => Object.assign(new emplois(), item));

            this.prixTotal = 0;
            //méthode pour mettre a jour le prix 
            const updatePrixTotal = (item: emplois) => {
              if (item.checkboxChecked) {
                this.prixTotal += item.totalPrix;
              } else {
                this.prixTotal -= item.totalPrix;
              }
            };

            this.tab_form.forEach(item => {
                item.calculateNombreHeures();
                item.coutParHeure = 20;
                item.calculateTotal();
                item.checkboxChecked = this.getCheckboxState(item.id);
                console.log('idcl:', item.idcl, 'idsl:', item.idsl, 'nombreHeures:', item.nombreHeures , 'prixHeureStatique:', item.coutParHeure, 'totalPrix:', item.totalPrix, 'checkboxChecked:', item.checkboxChecked);

                // Lier la fonction updatePrixTotal à chaque objet emplois
               item.updatePrixTotal = () => 
                  {updatePrixTotal(item);
                   this.saveCheckboxState(item.id, item.checkboxChecked);}

               // Appeler la fonction pour mettre à jour le prix total
               item.updatePrixTotal();
                return item;
            });
            console.log('Tab form:', this.tab_form);
        },
    (error) => {
      console.error('Error getting emploi temps', error);
    }
  );
}

// Méthode pour l'état de la case à cocher
getCheckboxState(id: number): boolean {
  return this.formateurService.getCheckboxState(id);
}

// Méthode pour enregist l'état de la case à cocher
saveCheckboxState(id: number, isChecked: boolean): void {
  this.formateurService.saveCheckboxState(id, isChecked);
}



// Fonction pour formater la date en chaîne de caractères
formatNgbDate(date: NgbDateStruct): string {
  if (!date) return null;

  return `${date.year}-${date.month}-${date.day}`;
}
}
