import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private apiService: ApiService) {}

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
        this.apiService.loading = true;
        
        return next.handle(request).pipe(
            catchError(error => {
                if(this.authService.isTokenExpired()){
                    this.authService.logout("/Login?ReturnURL="+this.router.url);
                    this._snackBar.open("Ihre Sitzung ist abgelaufen. Sie wurden ausgeloggt.", "OK", {
                        duration: 4000,
                    });
                }
                this.apiService.loading = false;
                return throwError(error);
            }),
            map(event => {
                if (event instanceof HttpResponse) {
                    this.apiService.loading = false;
                }         
                return event;
            })
            );
    }
}