import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formateur } from 'app/model/formateur.model';
import { FormateurService } from 'app/services/formateur.service';
import { map } from 'rxjs/operators';

export class User {
  public fname: string;
  public lname: string;
  public city: string;
}

@Component({
  selector: 'app-validation-forms',
  templateUrl: './validation-forms.component.html',
  styleUrls: ['./validation-forms.component.scss']
})

export class ValidationFormsComponent implements OnInit {
  
  formFormateur: FormGroup;
  idFormateur: number;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private formateurService: FormateurService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formFormateur = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      adresse: ['', Validators.required]
    });

    this.activatedRoute.params.subscribe(params => {
      this.idFormateur = params['id'];
      this.formateurService.getformateurParId(this.idFormateur).subscribe(formateur => {
        this.formFormateur.patchValue(formateur);
      });
    });
  }

  get f() { return this.formFormateur.controls; }

  submit(): void {
    this.submitted = true;

    
    if (this.formFormateur.invalid) {
      return;
    }

    const formateurModifie = this.formFormateur.value;

    this.formateurService.updateformateur(this.idFormateur, formateurModifie).subscribe(
      () => {
        console.log('Formateur mis à jour avec succès');
        this.router.navigate(['/forms/layout']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du formateur', error);
      }
    );
  }

}
