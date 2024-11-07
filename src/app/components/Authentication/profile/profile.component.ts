import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToyService } from '../../../services/toy.service';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
user : any = {};
  errorMessage: string = '';

  constructor(
    @Inject(ToyService) private toyService: ToyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.toyService.getProfile().subscribe(
      data => {
        console.log('Profile data:', data); // Debugging statement
        this.user = data.user;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error => {
        console.error('Error fetching profile:', error); // Debugging statement
        this.errorMessage = 'Error fetching profile';
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    );
  }
}
