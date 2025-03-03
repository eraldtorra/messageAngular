import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsernameService } from '../../services/username.service';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/AuthService.service';
import { CommonModule } from '@angular/common';
import { Token } from '../../models/token';

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

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private usernameService: UsernameService
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response: Token) => {
        // Handle successful login
        console.log('Login successful', response);
        // Store token or user info in localStorage/sessionStorage if needed
        localStorage.setItem('token', response.token);
        this.usernameService.setUsername(this.username);
        // Redirect to home page  
        this.router.navigate(['/home']);
      },
      error: (error) => {
        // Handle login error
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password';
      }
    });
  }

  register() {
    // Navigate to registration page or handle registration logic
    this.router.navigate(['/register']);
  }
 

 }
