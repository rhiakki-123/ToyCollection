import { Component, OnInit } from '@angular/core';
import { ToyService } from '../../services/toy.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-toy-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './toy-form.component.html',
  styleUrls: ['./toy-form.component.scss'],
  providers: [ToyService]
})
export class ToyFormComponent implements OnInit {
  toy = { name: '', type: '', price: 0 };
  errorMessage: string = '';
  isEditMode: boolean = false;
  toyId: number | null = null;

  //movie: string = 'avengers';


  constructor(
    private toyService: ToyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.toyId = +id;
        this.loadToy(this.toyId);
      }
    });
  }

  loadToy(id: number) {
    this.toyService.getToyByID(id).subscribe(
      (data) => this.toy = data,
      (error) => this.handleError('Error loading toy', error)
    );
  }

  saveToy() {
    if (this.isEditMode && this.toyId !== null) {
      this.toyService.updateToy(this.toyId, this.toy).pipe(
        catchError(error => {
          this.handleError('Error updating toy', error);
          return of(null);
        })
      ).subscribe(() => {
        this.router.navigate(['/toys']);
      });
    } else {
      this.toyService.createToy(this.toy).pipe(
        catchError(error => {
          this.handleError('Error saving toy', error);
          return of(null);
        })
      ).subscribe(() => {
        this.router.navigate(['/toys']);
      });
    }
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    this.errorMessage = message;
  }
}
