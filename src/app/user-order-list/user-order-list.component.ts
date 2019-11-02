import { Component, OnInit } from '@angular/core';

import { Order } from '../_models/order';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-user-order-list',
  templateUrl: './user-order-list.component.html',
  styleUrls: ['./user-order-list.component.css']
})
export class UserOrderListComponent implements OnInit {

  orderList: Order[];
  displayedColumns: string[] = ['id', 'orderDate', 'name', 'price', 'amount', 'totalPrice'];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getUserOrderList().subscribe((data)=>{
      this.orderList = data;
    })
  }

}
