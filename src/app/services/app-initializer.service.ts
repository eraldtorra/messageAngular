import { Injectable, inject } from '@angular/core';
import { AuthServiceService } from './AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  private authService = inject(AuthServiceService);

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      // Initialize authentication state from storage
      // This will restore user session if valid token exists
      this.authService.getCurrentUser();
      resolve();
    });
  }
}