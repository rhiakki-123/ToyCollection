// app.routes.ts
import { AuthConfig, OAuthModule, OAuthService } from 'angular-oauth2-oidc'; 
import { googleAuthConfig } from './auth.config'; // Adjust the path as necessary
import { RouterModule, Routes } from '@angular/router';
import { NgModule, Inject } from '@angular/core';
import { ToyListComponent } from './components/toy-list/toy-list.component';
import { ToyFormComponent } from './components/toy-form/toy-form.component';
import { SignupComponent } from './components/Authentication/signup/signup.component';
import { LoginComponent } from './components/Authentication/login/login.component';
import { ProfileComponent } from './components/Authentication/profile/profile.component';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';
import { OrderCreateComponent } from './components/orderManagement/order-create/order-create.component';
import { OrderDetailsComponent } from './components/orderManagement/order-details/order-details.component';
import { OrderHistoryComponent } from './components/orderManagement/order-history/order-history.component';
import { ToyDetailsComponent } from './components/toy-details/toy-details.component';
import { OrderUpdateComponent } from './components/orderManagement/order-update/order-update.component';
import { BrowserModule } from '@angular/platform-browser';
import { LogoutComponent } from './components/Authentication/logout/logout.component';

export const appRoutes: Routes = [
  { path: 'toys', component: ToyListComponent }, // Match exactly with URL path
  { path: 'add-toy', component: ToyFormComponent },
  { path: 'edit-toy/:id', component: ToyFormComponent }, // Route for editing a toy
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'order-create', component: OrderCreateComponent },
  { path: 'order-details/:order_id', component: OrderDetailsComponent },
  { path: 'order-update/:id', component: OrderUpdateComponent },
  { path: 'order-history', component: OrderHistoryComponent }, 
  // Default route
  //{ path: '', redirectTo: '/order-history', pathMatch: 'full' },
  // Wildcard route for a 404 page (optional)
  //{ path: '**', redirectTo: '/order-history' }, 
  { path: 'toy-details/:id', component: ToyDetailsComponent },
  {path : 'logout', component: LogoutComponent} 
  //{ path: 'logout', redirectTo: '/toys', pathMatch: 'full' },
 // { path: '', redirectTo: '/toys', pathMatch: 'full' },
 // { path: '**', redirectTo: '/toys', pathMatch: 'full' } // Wildcard route for a 404 page
];

@NgModule({
  imports: [//OAuthModule.forRoot(),
      RouterModule.forRoot(appRoutes)],
      exports: [RouterModule],
})
export class AppRoutingModule { 
  // private authConfig: AuthConfig = googleAuthConfig;

  // constructor(@Inject(OAuthService) private oauthService: OAuthService) {
  //   this.oauthService.configure(this.authConfig);
  // }

  // private configureOAuth() {
  //   this.oauthService.configure(this.authConfig);
  //   this.oauthService.loadDiscoveryDocumentAndTryLogin();
  // }

}