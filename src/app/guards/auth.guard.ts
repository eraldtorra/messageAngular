import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/AuthService.service';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  
  // Use the AuthService to check if user is logged in
  if (authService.isLoggedIn()) {
    return true;
  }
  
  // If not logged in, redirect to login page
  return router.parseUrl('/login');
};