import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { Item } from '../_models/item';
import { Image } from '../_models/image';

@Injectable({
     providedIn: 'root'
})
export class ProductService {
    private productListSubject: BehaviorSubject<Item[]>;
    public productList: Observable<Item[]>;
    private imageListSubject: BehaviorSubject<Image[]>;
    public imageList: Observable<Image[]>;
    //public imageList: Image[] = [];
    public imageIdList: number[] = [];

    constructor(private apiService: ApiService, private router: Router) {
        this.productListSubject = new BehaviorSubject<Item[]>([]);
        this.productList = this.productListSubject.asObservable();
        this.imageListSubject = new BehaviorSubject<Image[]>([]);
        this.imageList = this.imageListSubject.asObservable();
        this.updateProductList();
        this.updateImageList();
    }

    public get productListValue(): Item[] {
        return this.productListSubject.value;
    }

    public setProductListValue(newList: Item[]) {
        this.productListSubject.next(newList);
    }

    public updateProductList(){
        this.apiService.getProductList().subscribe((data) => {
            this.productListSubject.next(data);
        });
    }

    public get imageListValue(): Image[] {
        return this.imageListSubject.value;
    }

    public setImageListValue(newList: Image[]) {
        this.imageListSubject.next(newList);
    }

    public updateImageList(){
        this.apiService.getImages().subscribe((data) => {
            this.imageListSubject.next(data);
        });
    }

    public getImage(id:number):Image{
        var img = this.imageListSubject.value.find(i => i.id == id);
        if(img){
            return img;
        }else{
            this.apiService.getImages().subscribe(
                (data) => {
                    this.imageListSubject.next(data);
                },
                (error) => {
                    console.log("Could not load image");
                }
            )
        }
    }

    public loadAllImages():Image[]{
        if(this.imageListSubject.value && this.imageListSubject.value.length > 0){
            return this.imageListSubject.value;
        }else{
            this.apiService.getImages().subscribe(
                (data) => {
                    this.imageListSubject.next(data);
                },
                (error) => {
                    console.log("Could not load image");
                }
            )
        }
    }
}