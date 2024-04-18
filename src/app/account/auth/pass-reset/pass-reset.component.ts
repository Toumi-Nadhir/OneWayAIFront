import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.scss']
})

// Password Reset
export class PassResetComponent {
  // set the currenr year
  year: number = new Date().getFullYear();


  errorMessage: string = '';
  email: string = '';

  constructor(private authService: AuthenticationService, private router: Router) { }

  onSubmit() {
    this.errorMessage = '';
    this.authService.forgotPassword(this.email).subscribe(
      data => {
        console.log(this.email);
       this.router.navigate(['auth/twostep'], { queryParams: { email: this.email } }).catch(navError => console.log(navError));
        console.log('nadhir');
      },
      error => {
        if (error.status === 200) {
          this.router.navigate(['auth/twostep'], {queryParams: {email: this.email}}).catch(navError => console.log(navError));
          console.log(error.status);
        } else if (error){
          this.errorMessage = 'Email is incorrect';
          console.log(error.status);

          // Set the error message
          console.log('yassin');
        }
      }
    );
  }
 /* onSubmit() {
    this.authService.forgotPassword(this.email).subscribe(
      data => {

        console.log(this.email);
      },
      error => {
        this.errorMessage = error.error.message;
        this.router.navigate(['auth/twostep'], { queryParams: { email: this.email } }).catch(navError => console.log(navError));
        console.log(error);
      }
    );
  }*/
}
