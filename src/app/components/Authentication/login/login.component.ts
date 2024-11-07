import { Component } from '@angular/core';
import { ToyService } from '../../../services/toy.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user = { username: '', password: '' };
  errorMessage: string = '';

  constructor(private toyService: ToyService, private router: Router) {}

  login() {
    this.toyService.login(this.user).subscribe(
      (response: LoginResponse) => {
        console.log('login response', response);  // Debugging purposes
        if (isLocalStorageAvailable()) {
          // Ensure response has 'userId' and 'token'
          if (response.userId !== undefined && response.token) {
          localStorage.setItem('userId', response.userId.toString()); // Store the user ID
          localStorage.setItem('token', response.token); // Store the token
          this.router.navigate(['/profile']);
        } else {
          this.errorMessage = 'invalid login response from server'; 
          console.error('Missing userId or token in response:', response);
        } 
      } else {
          console.error('localStorage is not available in this browser');
          this.errorMessage = 'cannot access loacaStorage';
        }
      },
      error => {
        console.error('Login error:', error); // Debugging line
        // Provide more detailed error messages
        if (error.error) {
          this.errorMessage = 'Error logging in: ' + (error.error.error || JSON.stringify(error.error));
        } else {
          this.errorMessage = 'Error logging in: ' + error.message;
        }
      }
    );
  }
}


// Check if localStorage is available in the browser for storing user ID and token after login 

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = 'test';
    localStorage.setItem(testKey, 'testValue'); // Try to set a test key
    localStorage.removeItem(testKey); // Remove the test key
    return true; // If the above steps did not throw an error, localStorage is available
  } catch (e) {
    return false;
  }
}
  

