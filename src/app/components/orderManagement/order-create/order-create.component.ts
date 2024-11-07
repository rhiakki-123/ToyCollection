import { Component } from '@angular/core';
import { ToyService } from '../../../services/toy.service'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss']
})
export class OrderCreateComponent {
  order: any = {
    user_id: null,
    items: []
  };
  newItem: any = {
    toy_Id: null,
    quantity: null
  };
  errorMessage: string = '';

  constructor(private toyService: ToyService, private router: Router) {}

  addItem() {
    console.log('Toy ID:', this.newItem.toy_Id); // Debugging line
    console.log('Quantity:', this.newItem.quantity); // Debugging line
    if (this.newItem.toy_Id && this.newItem.quantity) {
      this.order.items.push({ ...this.newItem });
      this.newItem.toy_Id = null;
      this.newItem.quantity = null;
    } else {
      this.errorMessage = 'Please enter valid Toy ID and Quantity';
    }
  }

  createOrder() {
    console.log('Creating order:', this.order); // Debugging line
    if (this.order.user_id && this.order.items.length > 0) {
      this.toyService.createOrder(this.order).subscribe({
        next: (data) => {
          console.log('Order created:', data);
          if (data && data.ID) {
            this.router.navigate(['/order-details', data.ID]);
          } else {
            console.error('Order ID is undefined');
            this.errorMessage = 'Order ID is undefined';
          }
        },
        error: (error) => {
          console.error('Error creating order:', error);
          console.log('Order data:', this.order);
          this.errorMessage = 'Error creating order: ' + (error.error?.error || error.message || 'Unknown error');
        },
        complete: () => {
          console.log('Order creation completed');
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid User ID and add at least one item';
    }



    // console.log('Creating order:', this.order); // Debugging line
    // if (this.order.userId && this.order.items.length > 0) {
    //   this.toyService.createOrder(this.order).subscribe(
    //     (data) => {
    //       console.log('Order created:', data); // Debugging line
    //       this.router.navigate(['/order-history']);
    //     },
    //     error => {
    //       console.error('Error creating order:', error);
    //       console.log('Order data:', this.order);
    //       this.errorMessage = 'Error creating order: ' + (error.error?.error || error.message || 'Unknown error');
    //     }
    //   );
    // } else {
    //   this.errorMessage = 'Please enter a valid User ID and add at least one item';
    // }
  }
  removeItem(index: number): void {
    this.order.items.splice(index, 1);
  }
}