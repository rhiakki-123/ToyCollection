import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toy-details',
  standalone: true,
  templateUrl: './toy-details.component.html',
 imports: [CommonModule],
  styleUrls: ['./toy-details.component.scss']
})
export class ToyDetailsComponent implements OnInit {
  toy: any;
  errorMessage: string = '';

  constructor(private toyService: ToyService, private route: ActivatedRoute) {}

  ngOnInit() {
    const toyId = this.route.snapshot.paramMap.get('id');
    this.toyService.getToyByID(Number(toyId)).subscribe(
      data => this.toy = data,
      error => this.errorMessage = 'Error fetching toy: ' + error.error.error
    );
  }
}
