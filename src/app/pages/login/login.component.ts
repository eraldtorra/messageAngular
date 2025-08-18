import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsernameService } from '../../services/username.service';
import { FormsModule } from '@angular/forms';
import { AuthServiceService, LoginRequest } from '../../services/AuthService.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private usernameService: UsernameService,
    private themeService: ThemeService
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password,
      remember: this.rememberMe
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Login successful', response);
          this.usernameService.setUsername(response.user?.username || '');
          // Redirect to home page  
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.message;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Login service unavailable. Please try again.';
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
