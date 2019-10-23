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

  getProducts(){
    return this.httpClient.get<Item[]>(API_URL + '/productList');
  }

  login(data){
    return this.httpClient.post<User>(API_URL + '/login', data);
  }
}
