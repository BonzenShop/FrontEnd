import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { Role } from '../_models/role';
import { User } from '../_models/user';

@Injectable({
     providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public loading = false;

    constructor(private apiService: ApiService, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public isLoggedIn() {
        return this.currentUserSubject.value ? true : false;
      }
    
    public isAdmin() {
        return this.currentUserSubject.value  && this.currentUserSubject.value.role === Role.Admin;
    }

    public isEmployee() {
        return this.currentUserSubject.value  && (this.currentUserSubject.value.role === Role.Admin || this.currentUserSubject.value.role === Role.Employee);
    }

    public getUser(){
        return this.currentUserSubject.value.firstName;
    }

    login(username: string, password: string) {
        var body = { username, password };
        this.loading = true;
        this.apiService.login(body)
            .subscribe(
                user => {
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }
                    this.loading = false;
                },
                error => {
                    console.error(error);
                    this.loading = false;
                })
    }

    logout() {
        // remove user from local storage to log user out
        console.log("logout blabla");
        
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }

    signup(user: User) {
        var body = user;
        this.apiService.signup(body)
            .subscribe(
                user => {
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }
                    this.loading = false;
                },
                error => {
                    console.error(error);
                    this.loading = false;
                })
    }
}