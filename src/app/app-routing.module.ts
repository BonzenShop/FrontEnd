import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailComponent } from "./product-detail/product-detail.component"


const routes: Routes = [
  { path: 'detail', component: ProductDetailComponent },
  { path: 'item/:id', component: ProductDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
