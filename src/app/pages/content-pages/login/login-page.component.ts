import { Component, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormateurService } from 'app/services/formateur.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

  loginFormSubmitted = false;
  isLoginFailed = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    mdp: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true)
  });


  constructor(private router: Router, private formateurService: FormateurService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) {
  }

  get lf() {
    return this.loginForm.controls;
  }

  

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
  
    if (this.loginForm.invalid) {
      return;
    }
  
    this.spinner.show(undefined, {
      type: 'ball-triangle-path',
      size: 'medium',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fullScreen: true
    });
  
    const email = this.loginForm.value.email;
    const mdp = this.loginForm.value.mdp;
  
    this.formateurService.signIn(email, mdp).subscribe(
      (response) => {
        this.spinner.hide();
  
        // Vérifiez la réponse du service FormateurService.
        if (response.success) {
          // Utilisateur authentifié, redirigez vers le tableau de bord.
          this.router.navigate(['/dashboard/dashboard2']);
        } else {
          // Affichez un message d'erreur si l'authentification a échoué.
          this.isLoginFailed = true;
        }
      },
      (error) => {
        this.isLoginFailed = true;
        this.spinner.hide();
        console.error('Erreur lors de la connexion :', error);
      }
    );
  }
}
