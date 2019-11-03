import { Component, OnInit } from '@angular/core';

import { ShoppingCartService } from "../_services/shopping-cart.service";
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { Item } from "../_models/item";
import { ApiService } from '../_services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class cart_item {
  item:Item;
  quantity:number = 0;
}

export class order_item {
  user:number;
  orderDate:string;
  name:string;
  category:string;
  price:number;
  amount:number;
  totalPrice:number;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  //used for display
  totalPrice:String = "0€";
  //used to increase price
  totalPriceCalc:number = 0;
  currentUser: User;
  order: order_item[] = [];

  constructor(private shopping_cart_service: ShoppingCartService, private authenticationService: AuthenticationService, private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }

  shopping_cart:cart_item[] = [
    { quantity: 2,
      item: {
        id: 30,
        name: "Goldbarren",
        desc: "Ein Goldbarren gefüllt mit Gold",
        category: "Klunker",
        price: 20000,
        onStock: 10,
        image: "bla"
      }
    }, 
    { quantity: 3,
      item: {
        id: 20,
        name: "Putins Badewasser",
        desc: "Ein Goldbarren gefüllt mit Gold",
        category: "blalba",
        price: 200030,
        onStock: 10,
        image: "bla"
      }
    }
  ];

  ngOnInit() {
    //this.shopping_cart = this.shopping_cart_service.getCart();
    this.calculateTotalPrice();
    console.log(this.shopping_cart);
  }

  get isLoggedIn() {
    return this.currentUser ? true : false;
  }

  showLoginReminder(){
    this._snackBar.open("Zum Fortfahren bitte einloggen", "OK", {
      duration: 4000,
    });
  }

  quantityMinus(index:number) {
    if(this.shopping_cart[index].quantity>1){
      var start:number = Math.round(this.totalPriceCalc);
      this.totalPriceCalc -= this.shopping_cart[index].item.price;
      var end:number = Math.round(this.totalPriceCalc);
      
      this.shopping_cart[index].quantity--;

      this.animateValue(start,end, 500);
    }
  }

  quantityPlus(index:number){
    var start:number = Math.round(this.totalPriceCalc);
    this.totalPriceCalc += this.shopping_cart[index].item.price;
    var end:number = Math.round(this.totalPriceCalc);
    this.shopping_cart[index].quantity++;

    this.animateValue(start,end, 500);
  }

  submitQuantity(quantity:any, index:any){
    console.log(quantity);
    var start:number = Math.round(this.totalPriceCalc);
    this.totalPriceCalc += Math.round((quantity - this.shopping_cart[index].quantity) * this.shopping_cart[index].item.price);
    var end:number = this.totalPriceCalc;
    this.shopping_cart[index].quantity = quantity;
    console.log(start + " - " + end);
    
    this.animateValue(start,end,500);
    
    
  }

  removeItem(id:number) {
    var start = Math.round(this.totalPriceCalc);
    this.totalPriceCalc = this.totalPriceCalc - this.shopping_cart[id].quantity * this.shopping_cart[id].item.price;
    var end = Math.round(this.totalPriceCalc);

    this.shopping_cart.splice(id,1);
    
    this.animateValue(start, end, 1500);
  }

  calculateTotalPrice() {
    var price:number = 0;
    for(let item of this.shopping_cart) {
      price = price +
        item.quantity *
        item.item.price;
    }
    this.totalPriceCalc = price;
    this.totalPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
  }

  createOrder() {
    if(this.isLoggedIn) {
      var date = new Date();
      for(let item of this.shopping_cart) {
        var orderItem:order_item = {
          user: this.currentUser.id,
          orderDate: date.getDay()+"."+ date.getMonth() +"."+ date.getFullYear(),
          name: item.item.name,
          category: item.item.category,
          price: item.item.price,
          amount: item.quantity,
          totalPrice: this.totalPriceCalc
        }
        this.order.push(orderItem);
      }
      this.shopping_cart = [];
      this.animateValue(this.totalPriceCalc, 0, 2000);
      this.totalPriceCalc = 0;
      this.apiService.order(JSON.stringify(this.order));
    } else {
      this.showLoginReminder();
    }
  }

  moneyMaker() {
    var start:number = Math.round(this.totalPriceCalc);
    this.totalPriceCalc = this.totalPriceCalc*1.2;
    var end:number = Math.round(this.totalPriceCalc);
    this.animateValue(start,end, 1500);
    //document.getElementById("totalPrice").style.cssText = "background: linear-gradient(to bottom, #cfc09f 26%,#634f2c 24%, #cfc09f 26%, #cfc09f 27%,#ffecb3 40%,#3a2c0f 87%); -webkit-background-clip: text;-webkit-text-fill-color: transparent;";
    //this.totalPrice = this.totalPriceCalc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
  }

  animateValue(start, end, duration) {
    // assumes integer values for start and end

    var range = Math.abs(end - start);
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));
    
    // never go below minTimer
    stepTime = Math.max(stepTime, minTimer);
    
    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;
    
    let run = () => {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        if(start<=end) {
          var value = Math.round(end - (remaining * range));

          document.getElementById("totalPrice").style.cssText = "background: linear-gradient(to bottom, #cfc09f 26%,#634f2c 24%, #cfc09f 26%, #cfc09f 27%,#ffecb3 40%,#3a2c0f 87%); -webkit-background-clip: text;-webkit-text-fill-color: transparent;";
          this.totalPrice = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
          
            if (value >= end) {  
              clearInterval(timer);
            }
        } else {
          var value = Math.round(start - ((1-remaining) * range));

          document.getElementById("totalPrice").style.cssText = "background: linear-gradient(to bottom, #cfc09f 26%,#634f2c 24%, #cfc09f 26%, #cfc09f 27%,#ffecb3 40%,#3a2c0f 87%); -webkit-background-clip: text;-webkit-text-fill-color: transparent;";
          this.totalPrice = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
          
            if (value <= end) {  
              clearInterval(timer);
            }
        }  
    }
    timer = setInterval(run, stepTime);
  }
}
