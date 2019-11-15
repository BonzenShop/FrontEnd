import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from './_services/authentication.service';
import { ApiService } from './_services/api.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BonzenShop';
  email = '';
  password = '';

  constructor(public authenticationService: AuthenticationService, public router: Router, public apiService: ApiService){
  }
  login(){
    if(this.email != '' && this.password != ''){
      this.authenticationService.login(this.email, this.password);
      
    }
    this.email = '';
    this.password = '';
  }

  logout(){
    this.authenticationService.logout();
  }

  get loading(){
    return this.authenticationService.loading;
  }

  goToHome(){
    this.router.navigate(['/']);
  }
}
