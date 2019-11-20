import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from "../_services/authentication.service";
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mainInfos:any = {
    bestseller: "Kamel",
    topCustomerList: []
  };

  constructor(public authenticationService: AuthenticationService, private apiService: ApiService) {
    apiService.getMainInfos().subscribe(data => {
      data["topCustomerList"].sort((a,b) => (b.totalPurchase - a.totalPurchase));
      this.mainInfos = data;
    });
   }

  ngOnInit() {
  }
}
