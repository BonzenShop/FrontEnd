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

    public loadImage(id:number):Image{
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

    public setImage(img:Image){
        this.imageListSubject.value.push(img);
    }

    public generateNewImageId(){
        var list = this.getImageIdList();
        var newId = Math.round((Math.random()*10000+20000));
        while(list.some(x => x == newId)){
            newId = Math.round((Math.random()*10000+20000));
        }
        return newId;
    }

    getImageIdList(){
        if(this.imageIdList && this.imageIdList.length > 0){
            return this.imageIdList;
        }else{
            this.apiService.getImageIds().subscribe(data => {
                this.imageIdList = data;
                return this.imageIdList;
            })
        }
    }
}