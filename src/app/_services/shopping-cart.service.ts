import { Injectable } from '@angular/core';
import { Item } from "../_models/item";

export class cart_item {
  item:Item;
  quantity:number = 0;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private cart_items: cart_item[] = [];

  constructor() { }

  /**
   * add item to cart, increase quantity if item already in cart
   */
  public addToCart(p_item:Item, quantity:number) {
    var i = this.cart_items.findIndex(({item}) => item.id == p_item.id);
    
    if(i>=0) {
      this.cart_items[i].quantity++;
    } else {
      var cart_item:cart_item = {item:p_item,quantity:1};
      this.cart_items.push(cart_item);
    }
    console.log(this.cart_items);
  }

  /**
   * @param p_item item to be deleted
   * @param quantity amount to be deleted
   * @param wholeCart true if complete item to be deleted, ignores quantity
   */
  public removeFromCart(p_item:Item, quantity:number, wholeItem:boolean) {
    var i = this.cart_items.findIndex(({item}) => item.id == p_item.id);
    
    if(i>0) {
      if(wholeItem) {
        this.cart_items.splice(i, 1);
      } else {
        if(--this.cart_items[i].quantity <= 0){
          this.cart_items.splice(i, 1);
        }
      }
    }
  }

  public getCart():cart_item[]{
    return this.cart_items;
  }
}
