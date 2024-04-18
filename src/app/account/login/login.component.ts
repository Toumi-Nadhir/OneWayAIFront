import {Component, OnInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { login } from 'src/app/store/Authentication/authentication.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

// Login Component
export class LoginComponent implements OnInit{

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  a: any = 10;
  b: any = 20;
  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder,
              private authService:AuthenticationService,
              private router: Router,


) { }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(currentUser['scope'] === 'ADMIN'){
      this.router.navigate(['/']);
    } else if(currentUser['scope'] === 'USER'){
      this.router.navigate(['/User']);
    }

    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ['admin@1waydev.tn', [Validators.required, Validators.email]],
      password: ['adminADMIN#1919', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
/*  onSubmit() {
    this.submitted = true;

    const email = this.f['email'].value; // Get the username from the form
    const password = this.f['password'].value; // Get the password from the form

    // Login Api
    this.store.dispatch(login({ email: email, password: password }));
  }*/

 /* onSubmit() {
    this.submitted = true;

    // @ts-ignore
    const email = this.loginForm.get('email').value;
    // @ts-ignore
    const password = this.loginForm.get('password').value;

    this.authService.login(email, password).subscribe(
      (response) => {
        // Handle successful login if needed
        if (localStorage.getItem('currentUser')) {
          this.router.navigate(['/']); // Navigate to home page
        }
      },
      (error) => {
        // Handle login error if needed
      }
    );
  }*/

  onSubmit(): void {
    this.error = '';
    this.authService.login(this.f['email'].value, this.f['password'].value).subscribe(
      (response) => {
        if (response && response.accessToken) {
          if(this.authService.currentUser()['scope'] === 'ADMIN'){
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/User']);
          }
        } else {
          // Handle unexpected response
          // this.errorMessage = 'Unexpected response from server';
        }
      },
      (error) => {
        console.log(error)
        this.error = 'Invalid username or password';
        // Handle error response

        //this.errorMessage = 'Invalid username or password.';
      }
    );
  }
  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
