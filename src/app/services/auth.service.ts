import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  logout(): void {
    // Clear user authentication data from localStorage or other storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Add any other cleanup actions if necessary
  }

  // ... other AuthService methods
}
