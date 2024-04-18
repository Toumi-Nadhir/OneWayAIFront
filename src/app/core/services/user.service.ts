import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/store/Authentication/auth.models';
import {GlobalComponent} from "../../global-component";
import {AuthenticationService} from "./auth.service";
import {Observable} from "rxjs";



const API_URL = GlobalComponent.API_URL;
const USER = GlobalComponent.user;
@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient,
                private authService: AuthenticationService) { }
    /***
     * Get All User
     */
    getAll() {
        return this.http.get<User[]>(`api/users`);
    }

    /***
     * Facked User Register
     */
    register(user: User) {
        return this.http.post(`/users/register`, user);
    }
  getUserByEmail(email: string):Observable<User>   {
    return this.http.get<User>(API_URL+USER+`email/${email}`);
  }

  getCurrentUser() {
    const email = this.authService.currentUser()['sub'];
    console.log(email+"email");
    return this.getUserByEmail(email);

  }


}
