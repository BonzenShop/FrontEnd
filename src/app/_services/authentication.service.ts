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
                },
                error => {
                    console.error(error);
                })
    }

    changeUserData(user: User) {
        var body = user;
        this.apiService.changeUserData(body)
            .subscribe(
                user => {
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }
                },
                error => {
                    console.error(error);
                })
    }

    public decodeToken(): any {
        var token = this.currentUserSubject.value.token;
        if (!token || token === '') {
          return null;
        }
    
        let parts = token.split('.');
    
        if (parts.length !== 3) {
          throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
        }
    
        let decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
          throw new Error('Cannot decode the token.');
        }
    
        return JSON.parse(decoded);
    }

    public getTokenExpirationDate(): Date | null {
    let decoded: any;
    decoded = this.decodeToken();

    if (!decoded || !decoded.hasOwnProperty('exp')) {
        return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
    }

    public isTokenExpired(offsetSeconds?: number): boolean {
    var token = this.currentUserSubject.value.token;
    if (!token || token === '') {
        return true;
    }
    let date = this.getTokenExpirationDate();
    offsetSeconds = offsetSeconds || 0;

    if (date === null) {
        return false;
    }

    return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
    }

    public urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: {
        break;
        }
        case 2: {
        output += '==';
        break;
        }
        case 3: {
        output += '=';
        break;
        }
        default: {
        throw 'Illegal base64url string!';
        }
    }
    return this.b64DecodeUnicode(output);
    }

    // credits for decoder goes to https://github.com/atk
    private b64decode(str: string): string {
    let chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output: string = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 === 1) {
        throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
        );
    }

    for (
        // initialize result and counters
        let bc: number = 0, bs: any, buffer: any, idx: number = 0;
        // get next character
        (buffer = str.charAt(idx++));
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer &&
        (
        (bs = bc % 4 ? bs * 64 + buffer : buffer),
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4
        )
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    return output;
    }

    private b64DecodeUnicode(str: any) {
    return decodeURIComponent(
        Array.prototype.map
        .call(this.b64decode(str), (c: any) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    }
}