import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formateur } from 'app/model/formateur.model';
import { emplois } from 'app/model/emplois.model';
@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private apiUrl = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) { }

  
  getformateurs(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/lister`);
  }
  
  addformateur(formateur: formateur): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/create`, formateur);
  }
  
  getformateurParId(id: any): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/lister/${id}`);
  }

  deleteformateur(id: Number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/delete/${id}`);
  }
  
  updateformateur(id: any, formateur: formateur): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/edit/${id}`, formateur);
  }

  getEmploisFormateur(id: number, startDate: string, endDate: string): Observable<emplois[]> {
    const apiUrl = `${this.apiUrl}/emploisformateur/${id}?start_date=${startDate}&end_date=${endDate}`;
    return this.httpClient.get<emplois[]>(apiUrl);
  }

  getNombreFormateurs(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/nombre`);
  }
 
  private checkboxStates: { [key: number]: boolean } = {};

  // Méthode l'état de la case à cocher
  getCheckboxState(id: number): boolean {
    return this.checkboxStates[id] !== undefined ? this.checkboxStates[id] : true;
  }

  // Méthode pour sauvegarder l'état de la case à cocher
  saveCheckboxState(id: number, isChecked: boolean): void {
    this.checkboxStates[id] = isChecked;
    console.log('Checkbox States:', this.checkboxStates);
  }

  signIn(email: string, mdp: string): Observable<any> {
    const body = { email, mdp };
    return this.httpClient.post(`${this.apiUrl}/login`, body);
  }

  getNombreAdmins(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/nombre-admins`);
  }

  
}
