import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {

  private http = inject(HttpClient);
  private readonly api = `http://localhost:8080/auth`;

  private username = signal<string>('');

  usernameReadonly = this.username.asReadonly();

  getToken = localStorage.getItem('token');

  setUsername(username: string) {
    this.username.set(username);
  }


  getUsername() {

    //set the token in the header with name Authorization
    const headers = {

      'Authorization': `Bearer ${this.getToken}`

    }

    return this.http.get<any>(`${this.api}/getUsers`, { headers, withCredentials: true });
  }


  
}
