import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { Role } from '../_models/role';
import { User } from '../_models/user';
import { Item } from '../_models/item';

@Injectable({
     providedIn: 'root'
})
export class ProductService {
    private productListSubject: BehaviorSubject<Item[]>;
    public productList: Observable<Item[]>;

    constructor(private apiService: ApiService, private router: Router) {
        this.productListSubject = new BehaviorSubject<Item[]>([]);
        this.productList = this.productListSubject.asObservable();
        this.initProductList();
    }

    public get productListValue(): Item[] {
        return this.productListSubject.value;
    }

    public setProductListValue(newList: Item[]) {
        this.productListSubject.next(newList);
    }

    private initProductList(){
        this.apiService.getProductList().subscribe((data) => {
            this.productListSubject.next(data);
        });
    }
}