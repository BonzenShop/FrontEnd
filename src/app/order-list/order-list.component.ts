import { Component, OnInit } from '@angular/core';

import { Order } from '../_models/order';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orderList: Order[];
  displayedColumns: string[] = ['id', 'orderDate', 'user', 'name', 'category', 'price', 'amount', 'totalPrice'];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getOrderList().subscribe((data)=>{
      this.orderList = data;
    })
  }

}
