import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from "../shopping-cart.service";
import { Item } from "../item";

export class cart_item {
  item:Item;
  quantity:number = 0;
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

  constructor(private shopping_cart_service: ShoppingCartService) { }

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


  moneyMaker() {
    var start:number = Math.round(this.totalPriceCalc);
    this.totalPriceCalc = this.totalPriceCalc*1.2;
    var end:number = Math.round(this.totalPriceCalc);
    this.animateValue(start,end);
    //document.getElementById("totalPrice").style.cssText = "background: linear-gradient(to bottom, #cfc09f 26%,#634f2c 24%, #cfc09f 26%, #cfc09f 27%,#ffecb3 40%,#3a2c0f 87%); -webkit-background-clip: text;-webkit-text-fill-color: transparent;";
    //this.totalPrice = this.totalPriceCalc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
  }

  animateValue(start, end) {
    // assumes integer values for start and end

    var range = end - start;
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(1500 / range));
    
    // never go below minTimer
    stepTime = Math.max(stepTime, minTimer);
    
    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + 1500;
    var timer;
    
    let run = () => {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / 1500, 0);
        var value = Math.round(end - (remaining * range));
        
        document.getElementById("totalPrice").style.cssText = "background: linear-gradient(to bottom, #cfc09f 26%,#634f2c 24%, #cfc09f 26%, #cfc09f 27%,#ffecb3 40%,#3a2c0f 87%); -webkit-background-clip: text;-webkit-text-fill-color: transparent;";
        this.totalPrice = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
        
        if (value >= end) {  
          clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
  }
  
}
