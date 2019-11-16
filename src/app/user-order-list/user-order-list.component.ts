import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Order } from '../_models/order';
import { ApiService } from '../_services/api.service';
import { ProductService } from '../_services/product.service';
import { Image } from "../_models/image";

@Component({
  selector: 'app-user-order-list',
  templateUrl: './user-order-list.component.html',
  styleUrls: ['./user-order-list.component.css']
})
export class UserOrderListComponent implements OnInit {

  orderList: Order[] = [];
  imageList: Image[] = [];

  constructor(private apiService: ApiService,
    private _sanitizer: DomSanitizer,
    private productService: ProductService) {

      this.apiService.getUserOrderList().subscribe((data)=>{
        this.orderList = data;
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
      return "../assets/loading_spinner.svg";
    }
  }

  updateImagePaths(){
    for(let order of this.orderList){
      order.imagePath = this.getImagePath(order.image);
    }
  }

}
