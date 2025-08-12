import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsernameService } from '../../services/username.service';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/AuthService.service';
import { CommonModule } from '@angular/common';
import { Token } from '../../models/token';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private usernameService: UsernameService,
    private themeService: ThemeService
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response: Token) => {
        // Handle successful login
        console.log('Login successful', response);
        // Store token or user info in localStorage/sessionStorage if needed
        localStorage.setItem('token', response.token);
        this.usernameService.setUsername(this.username);
        // Redirect to home page  
        this.router.navigate(['/home']);
        this.isLoading = false;
      },
      error: (error) => {
        // Handle login error
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password';
        this.isLoading = false;
      }
    });
  }

  register() {
    // Navigate to registration page or handle registration logic
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkMode() {
    return this.themeService.isDark()();
  }
 

 }
