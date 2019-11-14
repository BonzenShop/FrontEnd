import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService, private _snackBar: MatSnackBar, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: 'Bearer '+ currentUser.token
                }
            });
        }
        
        return next.handle(request).pipe(
            catchError(error => {
                if(this.authService.isTokenExpired()){
                    this.authService.logout("/Login?ReturnURL="+this.router.url);
                    this._snackBar.open("Ihre Sitzung ist abgelaufen. Sie wurden ausgeloggt.", "OK", {
                        duration: 4000,
                    });
                }
                return throwError(error);
        }));
    }
}