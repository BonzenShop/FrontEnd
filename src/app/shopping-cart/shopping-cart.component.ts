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

  moneyMaker(){
    this.totalPriceCalc = this.totalPriceCalc*1.2;

    console.log(this.totalPrice);
    
    this.totalPrice = this.totalPriceCalc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
  }
}
