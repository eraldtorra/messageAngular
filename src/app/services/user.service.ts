import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UpdateUserRequest } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly api = `http://localhost:8080/user`;
  
  // Signal for current user
  private currentUser = signal<User | null>(null);
  currentUserReadonly = this.currentUser.asReadonly();

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.api}/profile`, { headers });
  }

  // Update user profile
  updateProfile(updateData: UpdateUserRequest): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.api}/profile`, updateData, { headers });
  }

  // Upload avatar
  uploadAvatar(file: File): Observable<{avatarUrl: string}> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post<{avatarUrl: string}>(`${this.api}/avatar`, formData, { headers });
  }

  // Set current user in signal
  setCurrentUser(user: User) {
    this.currentUser.set(user);
  }

  // Clear current user
  clearCurrentUser() {
    this.currentUser.set(null);
  }
}
