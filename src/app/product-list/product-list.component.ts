import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Item } from '../_models/item';
import { ApiService } from '../_services/api.service';
import { Image } from '../_models/image';
import { AuthenticationService } from '../_services/authentication.service';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  productList: Item[]
  imageList: Image[]
  categories: String[]
  searchText: string

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    public authService: AuthenticationService,
    private _sanitizer: DomSanitizer) { 
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
      }else{
        this.categories = []
      }
    });
    this.imageList = this.productService.loadAllImages();
    this.productService.productList.subscribe((data) => {
      this.productList = data;
      this.updateImagePaths();
    });
    this.productService.imageList.subscribe((data) => {
      this.imageList = data;
      this.updateImagePaths();
    });
  }

  ngOnInit() {
  }

  getImagePath(id:number):SafeResourceUrl{
    var img = this.imageList.find(i => i.id == id);
    if(img){
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/'+img.imgType+';base64,'+img.imgData);
    }else{
      return "../assets/loading_spinner.svg";
    }
  }

  updateImagePaths(){
    for(let item of this.productList){
      item.imagePath = this.getImagePath(item.image);
    }
  }

}
