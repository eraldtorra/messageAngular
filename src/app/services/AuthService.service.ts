import { HttpClient, HttpHeaders } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { Token } from '../models/token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly api = `http://localhost:8080/auth`;
  private http = inject(HttpClient);
  router = inject(Router)

  login(username: string, password: string): Observable<Token> {
    // For Basic Auth, create the authorization header
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });
    
    // Pass the headers in the options object
    // Make sure this endpoint matches your backend
    return this.http.post<Token>(`${this.api}/token`, {}, { headers: headers });
  }


  logout() {
    
  // Remove token from localStorage
  localStorage.removeItem('token');
  // Redirect to login page
  this.router.navigate(['/login']);
  
  }

}
