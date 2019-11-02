import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from "./home/home.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { ProductListComponent } from './product-list/product-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { AuthGuard } from './_guards/auth.guard';
import { Role } from './_models/role';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './register/register.component';
import { OrderListComponent } from './order-list/order-list.component';
import { UserOrderListComponent } from './user-order-list/user-order-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Produkte', component: ProductListComponent },
  { path: 'Produkt/:id', component: ProductDetailComponent },
  { path: 'Warenkorb',  component: ShoppingCartComponent},
  { path: 'Registrierung', component: RegisterComponent},
  { path: 'Konto', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'Bestellungen', component: UserOrderListComponent, canActivate: [AuthGuard]},
  { path: 'Admin/Kontoliste', component: UserListComponent, canActivate: [AuthGuard], data: { roles: [Role.Employee, Role.Admin] } },
  { path: 'Admin/Bestellungen', component: OrderListComponent, canActivate: [AuthGuard], data: { roles: [Role.Employee, Role.Admin]}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
