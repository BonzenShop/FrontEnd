import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  login(data){
    return this.httpClient.post<User>(API_URL + '/login', data);
  }

  order(data:String) {
    console.log(data);
    return this.httpClient.post<String>(API_URL + '/order', data)
  }
}
