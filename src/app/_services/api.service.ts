import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Order } from '../_models/order'
import { Item } from '../_models/item';
import { User } from '../_models/user';
import { Image } from '../_models/image';
import { environment } from '../../environments/environment';
import { VirtualTimeScheduler } from 'rxjs';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public loading = false;

  constructor(private httpClient: HttpClient) { }

  getProductList(){
    this.loading = true;
    return this.httpClient.get<Item[]>(API_URL + '/productList');
  }

  getUserList(){
    this.loading = true;
    return this.httpClient.get<User[]>(API_URL + '/userList');
  }

  getOrderList(){
    this.loading = true;
    return this.httpClient.get<Order[]>(API_URL + '/orderList');
  }

  getUserOrderList(){
    this.loading = true;
    return this.httpClient.get<Order[]>(API_URL + '/myOrderList');
  }

  saveProduct(item: Item, image: Image){
    this.loading = true;
    return this.httpClient.post<Item[]>(API_URL + '/saveProduct', {product: item, image: image});
  }

  order(data: Order[]){
    this.loading = true;
    return this.httpClient.post<Order[]>(API_URL + '/order', data);
  }

  changeRole(data: any){
    this.loading = true;
    return this.httpClient.post(API_URL + '/changeRole', data);
  }

  resetPassword(userId: number){
    this.loading = true;
    return this.httpClient.post(API_URL + '/resetPassword', userId);
  }

  deleteProduct(productId: number){
    this.loading = true;
    return this.httpClient.post<Item[]>(API_URL + '/deleteProduct', productId);
  }

  login(data){
    this.loading = true;
    return this.httpClient.post<User>(API_URL + '/login', data);
  }

  signup(data){
    this.loading = true;
    return this.httpClient.post<User>(API_URL + '/signup', data);
  }

  changeUserData(data){
    this.loading = true;
    return this.httpClient.post<User>(API_URL + '/updateUser', data);
  }

  getImages(){
    return this.httpClient.get<Image[]>(API_URL + "/getImages");
  }

  getImageIds(){
    this.loading = true;
    return this.httpClient.get<number[]>(API_URL + '/getImageIds');
  }

  getMainInfos(){
    return this.httpClient.get(API_URL + '/mainInfos');
  }

  public startLoading(){
    this.loading = true;
  }

  public stopLoading(){
    this.loading = false;
  }
}
