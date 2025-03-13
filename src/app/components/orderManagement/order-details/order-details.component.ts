import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToyService } from '../../../services/toy.service';
import { CommonModule } from '@angular/common';
import { error } from 'console';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../../models/order';


@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  errorMessage: string = '';

  constructor(
    private toyService: ToyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('order_id');
    if (orderId) {
      this.toyService.getOrder(Number(orderId)).subscribe(
        (data) => {
          this.order = data;
          if (!Array.isArray(this.order.order_items)) {
            this.order.order_items = [];
          }
          console.log('order details', this.order);
        },
        (error) => {
          this.errorMessage = 'Failed to load order details.';
          console.error('Error fetching order', error);
        }
      );
    } else {
      this.errorMessage = 'Order ID not found in route';
    }
  }
  deleteOrder(): void {
    if (this.order) {
      this.toyService.deleteOrder(this.order.ID).subscribe(
        (data) => {
          this.router.navigate(['/orders']);
        },
        (error) => {
          console.error('Error deleting order', error);
        }
      );
    }
    throw new Error('Method not implemented.');
  }
  navigateToEdit() {
    if (this.order) {
      this.router.navigate(['/orders', this.order.ID]);
    }
  }
}
