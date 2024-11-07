import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/user';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class ToyService {

  private apiUrl = 'http://localhost:8080'; // base url for the API

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Toy management methods
  getToys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/toys`, { headers: this.getAuthHeaders() });
  }

  getToyByID(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/toys/${id}`, { headers: this.getAuthHeaders() });
  }

  createToy(toy: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/toys`, toy, { headers: this.getAuthHeaders() });
  }

  updateToy(id: number, toy: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/toys/${id}`, toy, { headers: this.getAuthHeaders() });
  }

  deleteToy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/toys/${id}`, { headers: this.getAuthHeaders() });
  }

    // Order management methods
  createOrder(order: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, order, { headers: this.getAuthHeaders() });
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`, { headers: this.getAuthHeaders() });
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/users/${userId}/orders`, { headers: this.getAuthHeaders() });
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${orderId}/status`, { status }, { headers: this.getAuthHeaders() });
  }
  
  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${orderId}`, { headers: this.getAuthHeaders() });
  }

  // Inventory management methods
  addStock(payload: { toy_id: number, amount: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inventory/add`, payload, { headers: this.getAuthHeaders() });
  }

  removeStock(payload: { toy_id: number, amount: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inventory/remove`, payload, { headers: this.getAuthHeaders() });
  }

  getStock(toyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/inventory/stock/${toyId}`, { headers: this.getAuthHeaders() });
  }

  // Authentication methods
  signup(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  login(user: {username: string; password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, user, {headers: this.getAuthHeaders()});
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { headers: this.getAuthHeaders() });
  }


}
