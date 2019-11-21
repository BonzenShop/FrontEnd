import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ShoppingCartService } from "../_services/shopping-cart.service";
import { AuthenticationService } from '../_services/authentication.service';
import { ProductService } from '../_services/product.service';
import { User } from '../_models/user';
import { Item } from "../_models/item";
import { Order } from "../_models/order";
import { Image } from "../_models/image";
import { ApiService } from '../_services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  priceFactor:number = 1.0;
  priceFactorEs:String = "E";
  currentUser: User;
  order: Order[] = [];
  imageList: Image[];

  constructor(private shopping_cart_service: ShoppingCartService,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private datepipe: DatePipe,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private productService: ProductService) {
      
    this.productService.imageList.subscribe((data) => {
      this.imageList = data;
      this.updateImagePaths();
    });
  }

  shopping_cart:cart_item[] = [];

  ngOnInit() {
    console.log("hallo");
    console.log(this.shopping_cart_service.getCart());
    
    this.shopping_cart = JSON.parse(JSON.stringify(this.shopping_cart_service.getCart()));
    this.updateImagePaths();
    this.calculateTotalPrice();
  }

  get isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  showPopup(message:string){
    this._snackBar.open(message, "OK", {
      duration: 4000,
    });
  }

  quantityMinus(index:number) {
    if(this.shopping_cart[index].quantity>1){
      var start:number = Math.round(this.totalPriceCalc);
      this.totalPriceCalc -= this.shopping_cart[index].item.price;
      var end:number = Math.round(this.totalPriceCalc);
      
      this.shopping_cart[index].quantity--;
      localStorage.setItem("bonzenshoppingcart", JSON.stringify(this.shopping_cart));
      this.animateValue(start,end, 500);

      this.shopping_cart_service.getCart()[index].quantity--;
    }
  }

  quantityPlus(index:number){
    var start:number = Math.round(this.totalPriceCalc);
    this.totalPriceCalc += this.shopping_cart[index].item.price;
    var end:number = Math.round(this.totalPriceCalc);
    this.shopping_cart[index].quantity++;
    localStorage.setItem("bonzenshoppingcart", JSON.stringify(this.shopping_cart));
    this.animateValue(start,end, 500);

    this.shopping_cart_service.getCart()[index].quantity++;
  }

  submitQuantity(quantity:any, index:any){
    var start:number = Math.round(this.totalPriceCalc);
    this.totalPriceCalc += Math.round((quantity - this.shopping_cart[index].quantity) * this.shopping_cart[index].item.price);
    var end:number = this.totalPriceCalc;
    this.shopping_cart[index].quantity = quantity;
    localStorage.setItem("bonzenshoppingcart", JSON.stringify(this.shopping_cart));
    this.animateValue(start,end,500);

    this.shopping_cart_service.getCart()[index].quantity = quantity;
  }

  removeItem(id:number) {
    var start = Math.round(this.totalPriceCalc);
    this.totalPriceCalc = this.totalPriceCalc - this.shopping_cart[id].quantity * this.shopping_cart[id].item.price;
    var end = Math.round(this.totalPriceCalc);

    this.shopping_cart.splice(id,1);
    localStorage.setItem("bonzenshoppingcart", JSON.stringify(this.shopping_cart));
    this.animateValue(start, end, 1500);

    this.shopping_cart_service.getCart().splice(id,1);
    if(this.shopping_cart.length==0) {
      this.priceFactorEs="E"
    }
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
    if(this.isLoggedIn && this.shopping_cart.length>0) {
      var date = new Date();
      for(let item of this.shopping_cart) {
        var orderItem:Order = {
          id: 0,
          user: this.authenticationService.getUserId(),
          orderDate: this.datepipe.transform(date, 'dd.MM.yyyy'),
          name: item.item.name,
          category: item.item.category,
          price: item.item.price,
          amount: item.quantity,
          totalPrice: this.totalPriceCalc,
          image: item.item.image
        }
        this.order.push(orderItem);
      }
      console.log(this.order);
      this.shopping_cart = [];
      this.shopping_cart_service.setCart([]);
      console.log(this.shopping_cart_service.getCart());
      localStorage.setItem("bonzenshoppingcart", JSON.stringify(this.shopping_cart));
      this.animateValue(this.totalPriceCalc, 0, 150);
      this.totalPriceCalc = 0;
      this.apiService.order(this.order).subscribe((data) => {
        console.log(data);
      });
    } else if (!this.isLoggedIn) {
      this.showPopup("Zum Fortfahren bitte einloggen");
      this.router.navigateByUrl("/Login?ReturnURL="+this.router.url);
    } else  {
      this.showPopup("Warenkorb ist leer");
    }
  }

  moneyMaker() {
    this.priceFactorEs+="E";
    var start:number = Math.round(this.totalPriceCalc);
    var end:number = 0;
    for(let item of this.shopping_cart) {
      item.item.price = item.item.price*1.2;
      end = end +
            item.item.price *
            item.quantity;
    }
    end = Math.round(end);
    this.totalPriceCalc = end;
    
    this.animateValue(start,end, 1500);
  }

  animateValue(start, end, duration) {
    // assumes integer values for start and end

    console.log(this.shopping_cart_service.getCart());

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

          document.getElementById("totalPrice").style.cssText = "background:linear-gradient(to bottom, #BF953F, #FCF6BA, #B38728, #FBF5B7);  -webkit-background-clip: text;-webkit-text-fill-color: transparent;";
          this.totalPrice = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
          
            if (value >= end) {  
              clearInterval(timer);
            }
        } else {
          var value = Math.round(start - ((1-remaining) * range));

          document.getElementById("totalPrice").style.cssText = "background:linear-gradient(to bottom, #BF953F, #FCF6BA, #B38728, #FBF5B7);  -webkit-background-clip: text;-webkit-text-fill-color: transparent;";
          this.totalPrice = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
          
            if (value <= end) {  
              clearInterval(timer);
            }
        }  
    }
    timer = setInterval(run, stepTime);
  }

  getImagePath(id:number):SafeResourceUrl{
    if(this.imageList && this.imageList.length > 0){
      var img = this.imageList.find(i => i.id == id);
      if(img){
        return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/'+img.imgType+';base64,'+img.imgData);
      }else{
        return "../assets/image-placeholder.png";
      }
    }else{
      return "../assets/loading_spinner.svg";
    }
  }

  updateImagePaths(){
    for(let cart_item of this.shopping_cart){
      cart_item.item.imagePath = this.getImagePath(cart_item.item.image);
    }
  }
}
