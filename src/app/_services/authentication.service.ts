import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from './api.service';
import { Role } from '../_models/role';
import { User } from '../_models/user';
import { JwtHelper } from '../_helpers/jwtHelper';

@Injectable({
     providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public loading = false;

    constructor(private apiService: ApiService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private jwtHelper: JwtHelper) {
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

    public hasAdminRights() {
        return this.currentUserSubject.value  && this.currentUserSubject.value.role === Role.Admin;
    }

    public hasEmployeeRights() {
        return this.currentUserSubject.value  && (this.currentUserSubject.value.role === Role.Employee || this.currentUserSubject.value.role === Role.Admin);
    }
    
    public getUser(){
        return this.currentUserSubject.value.firstName;
    }

    public getUserId(){
        return this.currentUserSubject.value.id;
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

    logout(navigateURL?: string) {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        if(navigateURL){
            this.router.navigateByUrl(navigateURL);
        }else{
            this.router.navigate(['/']);
        }
        
    }

    signup(user: User, returnURL: string) {
        var body = user;
        this.apiService.signup(body)
            .subscribe(
                user => {
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }
                    this.router.navigateByUrl(returnURL);
                },
                error => {
                    console.error(error);
                    this.showPopup("Registrierung fehlgeschlagen.");
                })
    }

    changeUserData(user: User, returnURL: string) {
        var body = user;
        this.apiService.changeUserData(body)
            .subscribe(
                user => {
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }
                    this.router.navigateByUrl(returnURL);
                },
                error => {
                    console.error(error);
                    this.showPopup("Ihre Daten konnten nicht geändert werden.");
                })
    }

    showPopup(message:string){
        this._snackBar.open(message, "OK", {
        duration: 4000,
        });
    }

    public isTokenExpired(): boolean {
        return this.jwtHelper.isTokenExpired(this.currentUserSubject.value.token);
    }
}