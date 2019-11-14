import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      name: "Accessoires",
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
    imgData: "",
    imgType: ""
  };
  file: File;
  public imagePath: SafeResourceUrl;

  productList: Item[];
  myForm: FormGroup;

  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private _sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar) {
      this.myForm = this.formBuilder.group({
        name: [this.item.name, [Validators.required]],
        desc: [this.item.desc, [Validators.required]],
        category: [this.item.category, [Validators.required]],
        price: [this.item.price, [Validators.required]],
        onStock: [this.item.onStock, [Validators.required]],
        imgData: [this.item.imgData, [Validators.required]],
        imgType: [this.item.imgType, [Validators.required]]
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
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/'+this.myForm.controls.imgType.value+';base64,'+this.myForm.controls.imgData.value);
  }

  update(_id: string) {
    this.id = _id;
    if(_id && this.productList) {
      var item:Item = this.productList.find(({name}) => name == _id);
      if(item) {
        this.item = item;
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/'+this.myForm.controls.imgType.value+';base64,'+this.myForm.controls.imgData.value);
        this.myForm.controls.name.setValue(this.item.name);
        this.myForm.controls.desc.setValue(this.item.desc);
        this.myForm.controls.category.setValue(this.item.category);
        this.myForm.controls.price.setValue(this.item.price);
        this.myForm.controls.onStock.setValue(this.item.onStock);
        this.myForm.controls.imgData.setValue(this.item.imgData);
        this.myForm.controls.imgType.setValue(this.item.imgType);
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
      this.item.imgData = this.myForm.controls.imgData.value;
      this.item.imgType = this.myForm.controls.imgType.value;

      this.apiService.saveProduct(this.item).subscribe((data)=>{
        this.productService.setProductListValue(data);
      })

      this.router.navigate(['/Produkt/'+this.item.name]);
    }
  }

  cancel() {
    if(this.id != "Neu"){
      this.router.navigate(['/Produkt/'+this.item.name]);
    }else{
      this.router.navigate(['/Produkte']);
    }
  }

  valuesUnchanged() {
    return (this.item.name == this.myForm.controls.name.value &&
      this.item.desc == this.myForm.controls.desc.value &&
      this.item.category == this.myForm.controls.category.value &&
      this.item.price == this.myForm.controls.price.value &&
      this.item.onStock == this.myForm.controls.onStock.value &&
      this.item.imgData == this.myForm.controls.imgData.value &&
      this.item.imgType == this.myForm.controls.imgType.value);
  }

  selectFile(event) {
    this.file = event.target.files[0];
    var reader = new FileReader();
    reader.onload =this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.file);
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.myForm.controls.imgData.setValue(btoa(binaryString));
    this.myForm.controls.imgType.setValue(this.file.name.split('.').pop().toLowerCase());
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/'+this.myForm.controls.imgType.value+';base64,'+this.myForm.controls.imgData.value);
  }

  deleteBtn(){
    let snackBarRef = this._snackBar.open("Wirklich löschen?", "Ja", {
      duration: 3000,
    });
    snackBarRef.onAction().subscribe(()=> this.delete());
  }

  delete(){
    console.log("deleting");
    this.apiService.deleteProduct(this.item.id).subscribe(
      (data) => {
        console.log("deleted");
        this.productService.setProductListValue(data);
        this.router.navigate(["/Produkte"]);
      },
      (error) => {
        this.router.navigate(["/Produkte"]);
      }
    );
  }
}
