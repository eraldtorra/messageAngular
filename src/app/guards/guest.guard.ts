import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/AuthService.service';

export const guestGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  
  // If user is already logged in, redirect to home
  if (authService.isLoggedIn()) {
    return router.parseUrl('/home');
  }
  
  // If not logged in, allow access to guest pages
  return true;
};