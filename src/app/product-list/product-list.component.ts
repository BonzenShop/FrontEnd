import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Item } from '../_models/item';
import { Image } from '../_models/image';
import { AuthenticationService } from '../_services/authentication.service';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
/**
 * View of the product list
 */
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
    this.productService.productList.subscribe((data) => {
      data.sort((a, b) => (a.category > b.category ? 1 : ((a.category == b.category && a.price < b.price) ? 1 : -1)));
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
    if(this.imageList && this.imageList.length > 0){
      var img = this.imageList.find(i => i.id == id);
      if(img){
        return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/'+img.imgType+';base64,'+img.imgData);
      }else{
        return "../assets/image-placeholder.png";
      }
    }else{
      return "../assets/loading_spinner_small.svg";
    }
  }

  updateImagePaths(){
    for(let item of this.productList){
      item.imagePath = this.getImagePath(item.image);
    }
  }

}
