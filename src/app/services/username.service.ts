import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {

  private username = signal<string>('');

  usernameReadonly = this.username.asReadonly();

  setUsername(username: string) {
    this.username.set(username);
  }
}
