import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { Item } from '../_models/item';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  productList: Item[]
  categories: String[]
  searchText: string

  constructor(private route: ActivatedRoute, private productServie: ProductService, private authService: AuthenticationService) { 
    this.route.queryParams.subscribe(params => {
      var category = params['Kategorie'];
      if(category){
        if(["Transport", "Immobilien", "Accessoires", "Sonstiges"].some(el => el == category)){
          if(category == "Transport"){
              this.categories = ["Tiere", "Flugzeuge", "Autos", "Yachten", "Sonstige Transportmittel"];
          }
          if(category == "Immobilien"){
              this.categories = ["Monumente", "Residenzen", "Straßen"];
          }
          if(category == "Accessoires"){
              this.categories = ["Ringe", "Ketten", "Uhren"];
          }
          if(category == "Sonstiges"){
              this.categories = ["Edelsteine", "Gold", "Untertanen", "Haustiere"];
          }
        }else{
            this.categories = [category];
        }
      }
    });
    this.productServie.productList.subscribe((data) => {
      this.productList = data;
    });
  }

  ngOnInit() {
  }


}
