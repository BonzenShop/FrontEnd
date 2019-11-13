import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Order } from '../_models/order'
import { Item } from '../_models/item';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  getProductList(){
    return this.httpClient.get<Item[]>(API_URL + '/productList');
  }

  getUserList(){
    return this.httpClient.get<User[]>(API_URL + '/userList');
  }

  getOrderList(){
    return this.httpClient.get<Order[]>(API_URL + '/orderList');
  }

  getUserOrderList(){
    return this.httpClient.get<Order[]>(API_URL + '/myOrderList');
  }

  saveProduct(data: Item){
    return this.httpClient.post<Item[]>(API_URL + '/saveProduct', data);
  }

  order(data: Order[]){
    return this.httpClient.post<Order[]>(API_URL + '/order', data);
  }

  login(data){
    return this.httpClient.post<User>(API_URL + '/login', data);
  }

  signup(data){
    return this.httpClient.post<User>(API_URL + '/signup', data);
  }

  changeUserData(data){
    return this.httpClient.post<User>(API_URL + '/updateUser', data);
  }
}
