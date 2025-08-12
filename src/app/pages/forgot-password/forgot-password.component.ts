import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../services/AuthService.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isEmailSent: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  sendResetEmail() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;

    // Call the auth service to send reset email
    this.authService.forgotPassword(this.email).subscribe({
      next: (response: any) => {
        console.log('Password reset email sent', response);
        this.successMessage = 'Password reset instructions have been sent to your email address.';
        this.isEmailSent = true;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Failed to send reset email', error);
        this.errorMessage = error.error?.message || 'Failed to send reset email. Please try again.';
        this.isLoading = false;
      }
    });
  }

  resendEmail() {
    this.isEmailSent = false;
    this.sendResetEmail();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkMode() {
    return this.themeService.isDark()();
  }
}
