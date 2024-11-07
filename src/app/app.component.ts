import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToyFormComponent } from "./components/toy-form/toy-form.component";
import { ToyListComponent } from "./components/toy-list/toy-list.component";
import { ToyDetailsComponent } from './components/toy-details/toy-details.component';
import { SignupComponent } from './components/Authentication/signup/signup.component';
import { LoginComponent } from './components/Authentication/login/login.component';
import { ProfileComponent } from './components/Authentication/profile/profile.component';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';
import { OrderCreateComponent } from './components/orderManagement/order-create/order-create.component';
import { OrderHistoryComponent } from './components/orderManagement/order-history/order-history.component';
import { OrderDetailsComponent } from './components/orderManagement/order-details/order-details.component';
import { OrderUpdateComponent } from './components/orderManagement/order-update/order-update.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToyFormComponent, ToyListComponent, SignupComponent,
     LoginComponent, ProfileComponent, InventoryComponent, 
     OrderCreateComponent, OrderDetailsComponent,OrderHistoryComponent, ToyDetailsComponent, OrderUpdateComponent,
    RouterOutlet,RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'toy-collection';

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
