import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  productList: Item[]

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getProducts().subscribe((data)=>{
      console.log(data);
      this.productList = data;
    })
  }


}
