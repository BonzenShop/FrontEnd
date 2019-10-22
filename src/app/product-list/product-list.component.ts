import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Item } from '../item';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  productList: Item[]
  category: String

  constructor(private apiService: ApiService, private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.category = params['cat'];
  });
  }

  ngOnInit() {
    this.apiService.getProducts().subscribe((data)=>{
      this.productList = data;
    })
  }


}
