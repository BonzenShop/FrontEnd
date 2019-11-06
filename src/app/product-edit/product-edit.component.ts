import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ApiService } from '../_services/api.service';
import { Item } from "../_models/item";
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  id:string = "Neu";
  categoryGroups = [
    {
      name: "Transport",
      categories: ["Tiere", "Flugzeuge", "Autos", "Yachten", "Sonstige Transportmittel"]
    },
    {
      name: "Accessoirs",
      categories: ["Uhren", "Ketten", "Ringe"]
    },
    {
      name: "Immobilien",
      categories: ["Residenzen", "Monumente", "Straßen"]
    },
    {
      name: "Sonstiges",
      categories: ["Gold", "Edelsteine", "Haustiere",]
    }
  ]
  
  item:Item = {
    id: 0,
    name: "",
    desc: "",
    category: "",
    price: 0,
    onStock: 0,
    image: "../assets/Kamel-Placeholder.jpg"
  };

  productList: Item[];
  myForm: FormGroup;

  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService) {
      this.myForm = this.formBuilder.group({
        name: [this.item.name, [Validators.required]],
        desc: [this.item.desc, [Validators.required]],
        category: [this.item.category, [Validators.required]],
        price: [this.item.price, [Validators.required]],
        onStock: [this.item.onStock, [Validators.required]]
      });
      this.productService.productList.subscribe((data) => {
        this.productList = data;
        this.update(this.id);
      });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => 
      params.get("id") != "Neu" ? this.update(params.get("id")) : ''
    );
  }

  update(_id: string) {
    this.id = _id;
    if(_id && this.productList) {
      var item:Item = this.productList.find(({name}) => name == _id);
      if(item) {
        this.item = item;
        this.myForm.controls.name.setValue(this.item.name);
        this.myForm.controls.desc.setValue(this.item.desc);
        this.myForm.controls.category.setValue(this.item.category);
        this.myForm.controls.price.setValue(this.item.price);
        this.myForm.controls.onStock.setValue(this.item.onStock);
      }else{
        if(this.id != "Neu"){
          this.router.navigate(['/']);
        }
      }
    }  
  }

  save(){
    if(this.myForm.valid){

      this.item.name = this.myForm.controls.name.value;
      this.item.desc = this.myForm.controls.desc.value;
      this.item.category = this.myForm.controls.category.value;
      this.item.price = this.myForm.controls.price.value;
      this.item.onStock = this.myForm.controls.onStock.value;

      this.apiService.saveProduct(this.item).subscribe((data)=>{
        this.productService.setProductListValue(data);
      })

      this.router.navigate(['/Produkt/'+this.item.name]);
    }
  }

}
