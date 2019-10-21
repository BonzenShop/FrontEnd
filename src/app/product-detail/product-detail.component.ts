import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
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
    desc: "Ein Kamel königlicher Abstammung. Außerdem kackt es Gold und isst nur Kaviar und dieser Kaviar muss von Bigfoot serviert werden.",
    category: "Transport",
    price: 10000000,
    onStock: 2
  }

  constructor(private route: ActivatedRoute) { }

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
      this.item.onStock--;
    }
  }

}
