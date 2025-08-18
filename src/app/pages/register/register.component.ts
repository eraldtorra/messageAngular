import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceService, RegisterRequest } from '../../services/AuthService.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone: string = '';
  termsAccepted: boolean = false;
  newsletterSubscription: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  register() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.fullName || !this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (!this.termsAccepted) {
      this.errorMessage = 'You must accept the terms and conditions';
      return;
    }

    this.isLoading = true;

    const registerRequest: RegisterRequest = {
      fullName: this.fullName,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      phone: this.phone,
      termsAccepted: this.termsAccepted,
      newsletterSubscription: this.newsletterSubscription
    };

    // Call the auth service to register
    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Registration successful', response);
          this.successMessage = 'Account created successfully! Redirecting to home...';
          this.isLoading = false;
          
          // Redirect to home after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        } else {
          this.errorMessage = response.message;
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration service unavailable. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkMode() {
    return this.themeService.isDark()();
  }
}
