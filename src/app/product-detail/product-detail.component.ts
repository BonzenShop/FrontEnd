import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

import { Item } from "../_models/item";
import { SnackBarComponent } from "../snack-bar/snack-bar.component";
import { ShoppingCartService } from "../_services/shopping-cart.service";
import { AuthenticationService } from "../_services/authentication.service";
import { ProductService } from '../_services/product.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Image } from '../_models/image';

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
    image: 0
  };

  productList: Item[];
  imageList: Image[];
  image: Image = {
    id: 0,
    imgData: "",
    imgType: ""
  };
  public imagePath: SafeResourceUrl;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private shopping_cart: ShoppingCartService,
    public authService: AuthenticationService,
    private _sanitizer: DomSanitizer) {
      this.imagePath = "../assets/loading_spinner.svg";
      this.productService.productList.subscribe((data) => {
        this.productList = data;
        this.update(this.id);
      });
      this.productService.imageList.subscribe((data) => {
        this.imageList = data;
        this.updateImagePath();
      });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => this.update(params.get("id")) );
    this.createDisplayPrice(this.item.price);
  }

  showPopup(message:string){
    this.snackBar.open(message, "OK", {
      duration: 2500,
    });
  }

  update(_id: string) {
    this.id = _id;
    if(_id && this.productList) {
      var item:Item = this.productList.find(({name}) => name == _id);
      if(item) {
        this.item = item
        this.updateImagePath();
        this.createDisplayPrice(this.item.price);
      }
    }  
  }

  updateImagePath(){
    if(this.imageList && this.imageList.length > 0){
      var img = this.imageList.find(i => i.id == this.item.image);
      if(img){
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/'+img.imgType+';base64,'+img.imgData);
      }else{
        this.imagePath = "../assets/image-placeholder.png";
      }
    }else{
      this.imagePath = "../assets/loading_spinner.svg";
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
      this.showPopup("Zum Warenkorb hinzugefügt");
    }
  }
}