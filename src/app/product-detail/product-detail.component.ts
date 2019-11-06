import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ApiService } from '../_services/api.service';
import { Item } from "../_models/item";
import { ShoppingCartService } from "../_services/shopping-cart.service";
import { AuthenticationService } from "../_services/authentication.service";
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  id:string = "placeholder";
  displayPrice:string;
  
  item:Item = {
    id: 999,
    name: "Item not found",
    desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    category: "Transport",
    price: 10000000,
    onStock: 2,
    image: "../assets/Kamel-Placeholder.jpg"
  };

  productList: Item[];

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private shopping_cart: ShoppingCartService,
    private authService: AuthenticationService) {
      this.productService.productList.subscribe((data) => {
        this.productList = data;
        this.update(this.id);
      });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => this.update(params.get("id")) );
    this.createDisplayPrice(this.item.price);
  }

  update(_id: string) {
    this.id = _id;
    if(_id && this.productList) {
      var item:Item = this.productList.find(({name}) => name == _id);
      if(item) {
        this.item = item
        this.createDisplayPrice(this.item.price);
      }
    }  
  }

  /**
   * adds "." to the numbers to make larger ones easier to read
   */
  createDisplayPrice(number: number) {
    this.displayPrice = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  addItem() {
    if(this.item.onStock > 0) {
      this.shopping_cart.addToCart(this.item,1);
      this.item.onStock--;
    }
  }

}
