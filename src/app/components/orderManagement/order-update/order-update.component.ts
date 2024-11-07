import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToyService } from '../../../services/toy.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { MatFormFieldModule } from '@angular/material/form-field';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Order } from '../../../models/order';



@Component({
  selector: 'app-order-update',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
  ],
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.scss']
})
export class OrderUpdateComponent implements OnInit {
  order: Order | undefined;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private toyService: ToyService,
    private route: ActivatedRoute,
    public router: Router,
    @Inject(MatSnackBar) private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.toyService.getOrder(Number(orderId)).subscribe(
        data => {
          this.order = data;
          console.log('Fetched order:', this.order); // Debugging line
        },
        error => {
          this.errorMessage = 'Error fetching order details: ' + error.error.error;
          console.error('Error fetching order:', error); // Debugging line
        }
      );
    } else {
      this.errorMessage = 'Order ID not found in route';
    }
  }

  public navigateToOrderHistory(): void {
    this.router.navigate(['/order-history']);
  }

  updateOrder() {
    if (this.order) {
      this.toyService.updateOrderStatus(this.order.ID, this.order.status).subscribe(
        response => {
          console.log('Order updated:', response);
          this.successMessage = 'Order updated successfully!';
          this.snackBar.open('Order updated successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/order-history']);
        },
        error => {
          this.errorMessage = 'Error updating order: ' + error.error.error;
          console.error('Update error:', error); // Debugging line
        }
      );
    }
  }
}
