import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private usersData: any = null;

  constructor(private http: HttpClient) {}

  // Load users from JSON file
  loadUsers(): Observable<User[]> {
    // Import the JSON data directly
    return this.http.get<any>('/assets/data/users.json').pipe(
      map(response => response.users as User[])
    );
  }

  // Get all users from JSON file
  getAllUsers(): Observable<User[]> {
    return this.http.get<any>('/assets/data/users.json').pipe(
      map(response => response.users as User[])
    );
  }


  // Search users by name or email
  searchUsers(query: string): Observable<User[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => 
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  // Get user by ID
  getUserById(id: string): Observable<User | undefined> {
    return this.getAllUsers().pipe(
      map(users => users.find(user => user.id === id))
    );
  }
}
