import { Component, OnInit } from '@angular/core';
import { ToyService } from '../../services/toy.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Toy {
  id: number;
  name: string;
  type: string;
  price: number;
}

@Component({
  selector: 'app-toy-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toy-list.component.html',
  styleUrls: ['./toy-list.component.scss'],
  providers: [ToyService]
})
export class ToyListComponent implements OnInit {
  toys: any[] = [];
  errorMessage: string = '';

  constructor(private toyService: ToyService, private router: Router) {} // Inject ToyService

  ngOnInit(): void {
    this.loadToys();
  }

  loadToys() {
    this.toyService.getToys().pipe(
      catchError(error => {
        this.handleError('Error loading toys', error);
        return of([]);
      })
    ).subscribe(
      (data) => (this.toys = data)
    );
  }

  deleteToy(id: number) {
    this.toyService.deleteToy(id).pipe(
      catchError(error => {
        this.handleError('Error deleting toy', error);
        return of(null);
      })
    ).subscribe(() => {
      this.toys = this.toys.filter((toy) => toy.id !== id);
    });
  }

  editToy(id: number) {
    this.router.navigate(['/edit-toy', id]);
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    this.errorMessage = message;
  }

  detailsToy(id: number) {
    this.router.navigate(['/toy-details', id]);
  }
}
