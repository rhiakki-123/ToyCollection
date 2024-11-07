import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ToyService } from '../../../services/toy.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  errorMessage: string = '';
  //userId: number | null = null;
  loading: boolean = false;

  constructor(private toyService: ToyService,
    //@Inject(PLATFORM_ID) private platformId: Object
  ) {}
 ngOnInit() {

    const userId = localStorage.getItem('userId');
    console.log('Retrieved userId from localStorage:', userId); // Debugging line
    if (userId) {
      const numericUserId = Number(userId);
      console.log('Converted userId to number:', numericUserId); // Debugging line
      if (!isNaN(numericUserId)) {
        this.toyService.getUserOrders(numericUserId).subscribe(
          data => { this.orders = data,
          console.log('Fetched order history:', this.orders)
        },            
        error => {
            console.log('Error fetching order history:', error); // Debugging line
            this.errorMessage = 'Error fetching order history: ' + (error.error?.error || error.message ||'Unknown error');
          } 
        );
      } else {
        this.errorMessage = 'Invalid user ID';
      }
    } else {
      this.errorMessage = 'User ID not found in localStorage';
    }
  }

   getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'shipped':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }
 
}
  
  // getStatusClass(status: string): string {
  //   switch (status.toLowerCase()) {
  //     case 'pending':
  //       return 'pending';
  //     case 'shipped':
  //       return 'shipped';
  //     case 'delivered':
  //       return 'delivered';
  //     case 'cancelled':
  //       return 'cancelled';
  //     default:
  //       return 'pending';
  //   }
  // }


 //   const userId = localStorage.getItem('userId');
  //   console.log('Retrieved userId from localStorage:', userId); // Debugging line
  //   if (userId) {
  //     const numericUserId = Number(userId);
  //     console.log('Converted userId to number:', numericUserId); // Debugging line
  //     if (!isNaN(numericUserId)) {
  //       this.toyService.getUserOrders(numericUserId).subscribe(
  //         data => { this.orders = data,
  //         console.log('Fetched order history:', this.orders)
  //       },            
  //       error => {
  //           console.log('Error fetching order history:', error); // Debugging line
  //           this.errorMessage = 'Error fetching order history: ' + (error.error?.error || error.message ||'Unknown error');
  //         } 
  //       );
  //     } else {
  //       this.errorMessage = 'Invalid user ID';
  //     }
  //   } else {
  //     this.errorMessage = 'User ID not found in localStorage';
  //   }
  // }
