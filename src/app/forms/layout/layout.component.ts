import { Component, OnInit } from '@angular/core';
import { formateur } from 'app/model/formateur.model';
import { FormateurService } from 'app/services/formateur.service';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { DatatableData } from 'app/data-tables/data/datatables.data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  //préparation des colone de data table 
  public columns = [
    { name: 'CodeF', prop: 'id' },
    { name: 'Nom', prop: 'nom' },
    { name: 'Prénom', prop: 'prenom' },
    { name: 'E-mail', prop: 'mail' },
    { name: 'N° Télèphone', prop: 'tel' },
    { name: 'Addresse', prop: 'adresse' },
    { name: 'Actions' },

  ];

  public ColumnMode = ColumnMode;

  public tab_form: formateur[];

  constructor(private formateurService: FormateurService , private route:Router) { }

  ngOnInit(): void 
  {
    this.formateurService.getformateurs().subscribe(
      (data) => {
        this.tab_form = data;
      },
      (error) => {
        console.error('Error de récuperer formateurs', error);
      }
    );
  }

  deleteFormateur(id: Number): void {
    const conf = confirm("tu est sur de supprimer cette formateur ?");
    if (conf) {
      this.formateurService.deleteformateur(id).subscribe(
        () => {
          console.log('Formateur supprimer avec succée');
          console.log(conf);
        },
        (error) => {
          console.error('Error ', error);
        }
      );
    }
  }
 

  

  updateFormateur(id: any): void 
  {
    if (id) {
      this.route.navigate(['/forms/validation', id]);
    } 
    else {
      console.error('ID is undefined or null.');
    }  
  }

  addFormateur():void
  {
    this.route.navigate(['/forms/archwizard']);
  }

  
}
