import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    return true;
  }
  
  // If no token found, redirect to login page
  return router.parseUrl('/login');
};