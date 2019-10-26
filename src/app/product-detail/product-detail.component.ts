import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ShoppingCartService } from "../shopping-cart.service";
import { Item } from "../item";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  id:string = "placeholder";
  displayPrice:string;
  
  item:Item = {
    id: 32,
    name: "Kamel",
    desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    category: "Transport",
    price: 10000000,
    onStock: 2,
    image: "../assets/Kamel-Placeholder.jpg"
  }

  constructor(private route: ActivatedRoute, private shopping_cart: ShoppingCartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => this.update(params.get("id")) );
    this.createDisplayPrice(this.item.price);
  }

  update(id: string) {
    this.id = id;
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
