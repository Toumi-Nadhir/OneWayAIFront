import { Component } from '@angular/core';
import {UserProfileService} from "../../../core/services/user.service";
import {AuthenticationService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

// profile component
export class ProfileComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  role: any;
  currentUser:any
 constructor(  private authService: AuthenticationService,
   private userService: UserProfileService) {
 }
  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Pages', active: true },
      { label: 'Profile', active: true }
    ];


    console.log(this.currentUser);

    this.role=this.authService.currentUser()['scope']
    console.log(this.role);
    this.userService.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        console.log(this.currentUser);
      },
      error => {
        console.error('Error:', error);
      }
    );


  }

  // follow button toggle
  Followbtn(ev: any) {
    ev.target.closest('button').classList.toggle('active')
  }
}
