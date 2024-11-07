import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(
    private authservice: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
    console.log('Logging out');
  }

}
