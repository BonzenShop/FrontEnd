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
  category: String
  categories: String[]

  constructor(private route: ActivatedRoute, private productServie: ProductService, private authService: AuthenticationService) { 
    this.route.queryParams.subscribe(params => {
      this.category = params['Kategorie'];
      var cat = params['Kategorie'];
      if(["Transport", "Immobilien", "Accessoires", "Sonstiges"].some(el => el == cat)){
        if(cat == "Transport"){
            return this.categories = ["Tiere", "Flugzeuge", "Autos", "Yachten", "Sonstige Transportmittel"];
        }
        if(cat == "Immobilien"){
            return this.categories = ["Monumente", "Residenzen", "Straßen"];
        }
        if(cat == "Accessoires"){
            return this.categories = ["Ringe", "Ketten", "Uhren"];
        }
        if(cat == "Sonstiges"){
            return this.categories = ["Edelsteine", "Gold", "Untertanen", "Haustiere"];
        }
    }else{
        return this.categories = [cat];
    }
    });
    this.productServie.productList.subscribe((data) => {
      this.productList = data;
    });
  }

  ngOnInit() {
  }


}
