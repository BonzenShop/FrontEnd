import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

import { Order } from '../_models/order';
import { ApiService } from '../_services/api.service';
import { ProductService } from '../_services/product.service';
import { Image } from "../_models/image";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
/**
 * shows all orders - adminView
 */
export class OrderListComponent implements OnInit {

  orderList: Order[] = [];
  imageList: Image[] = [];

  constructor(private apiService: ApiService,
    private _sanitizer: DomSanitizer,
    private productService: ProductService,
    private datepipe: DatePipe) {

      this.apiService.getOrderList().subscribe((data)=>{
        data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        this.orderList = data;
        this.updateImagePaths();
      });

      this.productService.imageList.subscribe((data) => {
        this.imageList = data;
        this.updateImagePaths();
      })
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
    for(let order of this.orderList){
      order.imagePath = this.getImagePath(order.image);
    }
  }

  displayDate(date: string){
    return this.datepipe.transform(date, 'dd.MM.yyyy');
  }

}
