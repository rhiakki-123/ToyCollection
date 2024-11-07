import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToyService } from '../../../services/toy.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent {
  toyId!: number;
  amount: number = 0; // Initialize with a default value of 0
  stock?: number;  // Mark as optional to avoid error when stock is undefined
  errorMessage: string = '';

  constructor(private toyService: ToyService) {}

  addStock() {
    const payload = {
      toy_id: this.toyId,
      amount: this.amount
    };
    this.toyService.addStock(payload).subscribe(
      () => this.getStock(),
      error => this.errorMessage = 'Error adding stock: ' + error.error.error
    );
  }

  removeStock() {
    const payload = {
      toy_id: this.toyId,
      amount: this.amount
    };
    this.toyService.removeStock(payload).subscribe(
      () => this.getStock(),
      error => this.errorMessage = 'Error removing stock: ' + error.error.error
    );
  }

  getStock() {
    this.toyService.getStock(this.toyId).subscribe(
      data => this.stock = data.stock,
      error => this.errorMessage = 'Error fetching stock: ' + error.error.error
    );
  }
}
