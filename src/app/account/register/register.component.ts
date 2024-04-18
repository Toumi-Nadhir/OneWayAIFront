import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

// Register Auth
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { Register } from 'src/app/store/Authentication/authentication.actions';
import {chatMessagesData} from "../../pages/forms/advance/data";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

// Register Component
export class RegisterComponent {
  // Login Form
  signupForm!: UntypedFormGroup;
  submitted = false;
  successmsg = false;
  error = '';
  emailError = '';
  passwordError = '';
  firstNameError = '';
  lastNameError = '';
  // set the current year
  year: number = new Date().getFullYear();

  fieldTextType!: boolean;

  searchTerm: string = '';
  constructor(private formBuilder: UntypedFormBuilder,    private authService:AuthenticationService,
              private router: Router,) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])'), Validators.pattern('(?=.*[A-Z])'), Validators.pattern('(?=.*\\d)'), Validators.minLength(8)]],
      mobileNumber: ['', Validators.required] // Add mobileNumber field
    });
  }

    // convenience getter for easy access to form fields
    get f() { return this.signupForm.controls; }
  get password() { return this.signupForm.get('password'); }

  hasLowercase() {
    const pattern = /(?=.*[a-z])/;
    return this.password?.hasError('pattern') && !pattern.test(this.password.value);
  }

  hasUppercase() {
    const pattern = /(?=.*[A-Z])/;
    return this.password?.hasError('pattern') && !pattern.test(this.password.value);
  }

  hasNumber() {
    const pattern = /(?=.*\d)/;
    return this.password?.hasError('pattern') && !pattern.test(this.password.value);
  }

  hasMinLength() {
    return this.password?.hasError('minlength');
  }
  /**
   * Register submit form
   */
/*
  onSubmit() {
    this.submitted = true;

    const email = this.f['email'].value;
    const name = this.f['name'].value;
    const password = this.f['password'].value;

    //Dispatch Action
    this.store.dispatch(Register({ email: email, first_name: name, password: password }));
  }
*/

  // ...
  Default = chatMessagesData;
  selectedCountry = this.Default[228]; // Default selected country
  filterCountries(): void {
    this.Default = this.originalCountries.filter(country =>
      country.countryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      country.countryCode.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  originalCountries = [...chatMessagesData];
  selectValue(data: any) {
    this.selectedCountry = data;
  }
  onSearchChange(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchTerm = searchValue;
    this.filterCountries();
  }
onSubmit() {
  this.submitted = true;
  this.emailError = '';
  this.passwordError = '';
  this.firstNameError = '';
  this.lastNameError = '';
  const fmobileNumber = this.f['mobileNumber'].value;
  let countryCode = this.selectedCountry.countryCode;
  let mobileNumber = `${countryCode} ${fmobileNumber}`;
  const firstName = this.f['firstName'].value;
  const lastName = this.f['lastName'].value;
  const email = this.f['email'].value;
  const password = this.f['password'].value;

  // Call AuthService method to register user
  this.authService.registerUser(firstName, lastName, email, password, mobileNumber).subscribe(
    (response) => {
      this.router.navigate(['/auth/login']);
      console.log('User registered successfully:', response);
    },
    (error) => {
      if (error.status === 400) {
        console.log('Bad Request:', error.error.firstName);
        if (error.error.firstName && error.error.lastName && error.error.password) {
          this.firstNameError = 'first name length min is 3 and max is 25';
          this.lastNameError = 'last name is required and cannot be blank.';
          this.passwordError = 'Password must contain at least one lowercase letter, one uppercase letter, and one number.';
        }else if (error.error.firstName && error.error.password) {
          console.log('Bad Request:', error);
          this.firstNameError = 'first name length min is 3 and max is 25';
          this.passwordError = 'Password must contain at least one lowercase letter, one uppercase letter, and one number.';
        } else if (error.error.firstName && error.error.lastName) {
          console.log('Bad Request:', error);
          this.lastNameError = 'last name is required and cannot be blank.';
          this.firstNameError = 'first name length min is 3 and max is 25';
        }else if (error.error.password && error.error.lastName) {
          console.log('Bad Request:', error);
          this.lastNameError = 'last name is required and cannot be blank.';
          this.passwordError = 'Password must contain at least one lowercase letter, one uppercase letter, and one number.';
        } else if (error.error.firstName) {
          console.log('Bad Request:', error);
          this.firstNameError = 'first name length min is 3 and max is 25';
        } else if (error.error.lastName) {
          console.log('Bad Request:', error);
          this.lastNameError = 'Last Name is required';
        }else if (error.error.password ) {
        console.log('Bad Request:', error);
        this.passwordError = 'Password must contain at least one lowercase letter, one uppercase letter, and one number.';
      }
      } else if(error.status === 500){
        if (error.error.error === 'Email already exists') {
          console.log('Internal Server Error:', error.error.error);
          this.emailError = 'Email already exists';
        }else {
          console.log('An unexpected error occurred:', error);
        }
      } else {
        console.log('An unexpected error occurred:', error);
      }
    }
  );

}
  /**
 * Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  //  protected readonly Default = chatMessagesData;
}