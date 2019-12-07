import { Injectable } from '@angular/core';
import { Item } from "../_models/item";

export class CartItem {
  item:Item;
  quantity:number = 0;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private cartItems: CartItem[] = [];

  constructor() {
    var data = JSON.parse(localStorage.getItem("bonzenshoppingcart"));
    if(data){
      this.cartItems = data;
    }
  }

  /**
   * add item to cart, increase quantity if item already in cart
   */
  public addToCart(pItem:Item, quantity:number) {
    var i = this.cartItems.findIndex(({item}) => item.id == pItem.id);
    
    if(i>=0) {
      this.cartItems[i].quantity++;
    } else {
      var cartItem:CartItem = {item:pItem,quantity:1};
      this.cartItems.push(cartItem);
    }
    localStorage.setItem("bonzenshoppingcart", JSON.stringify(this.cartItems));
  }

  /**
   * @param pItem item to be deleted
   * @param quantity amount to be deleted
   * @param wholeCart true if complete item to be deleted, ignores quantity
   */
  public removeFromCart(pItem:Item, quantity:number, wholeItem:boolean) {
    var i = this.cartItems.findIndex(({item}) => item.id == pItem.id);
    
    if(i>0) {
      if(wholeItem) {
        this.cartItems.splice(i, 1);
      } else {
        if(--this.cartItems[i].quantity <= 0){
          this.cartItems.splice(i, 1);
        }
      }
    }
    localStorage.setItem("bonzenshoppingcart", JSON.stringify(this.cartItems));
  }

  public getCart():CartItem[]{
    return this.cartItems;
  }

  public setCart(array:CartItem[]){
    this.cartItems = array;
  } 
}
