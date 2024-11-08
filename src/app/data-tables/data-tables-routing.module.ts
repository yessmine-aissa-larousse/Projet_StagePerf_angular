import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesComponent } from './data-tables.component';



const routes: Routes = [
  {
    path: '',
    component: DataTablesComponent,
    data: {
      title: 'Gestion Paiement'
    },

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataTablesRoutingModule { }
