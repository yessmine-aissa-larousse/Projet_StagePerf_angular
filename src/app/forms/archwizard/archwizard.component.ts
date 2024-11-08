import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import {  FormGroup, Validators , FormBuilder} from '@angular/forms';
import { FormateurService } from 'app/services/formateur.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-archwizard',
  templateUrl: './archwizard.component.html',
  styleUrls: ['./archwizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchwizardComponent implements OnInit 
{

  formformateur!: FormGroup;
  submitted = false;
  constructor(private fb:FormBuilder , private formateurService : FormateurService , private router: Router ) {

  }

  ngOnInit() {
    this.formformateur = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      adresse: ['', Validators.required]
    });
  }

  submit() {
    this.submitted = true;
    this.formateurService.addformateur(this.formformateur.value).subscribe(
      data => {
        console.log('Post request successful', data);
        this.router.navigate(['/forms/layout']);
      },
      error => {
        console.error('Error during post request', error);
      }
    );
  }
  

  
 

}
