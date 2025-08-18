import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  termsAccepted: boolean;
  newsletterSubscription?: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private currentUser: AuthUser | null = null;

  // Load auth data from JSON file
  private loadAuthData(): Observable<any> {
    return this.http.get<any>('/assets/data/auth-data.json').pipe(
      map(response => response.authData),
      catchError(error => {
        console.error('Error loading auth data:', error);
        return throwError(() => new Error('Failed to load authentication data'));
      })
    );
  }

  // Login method
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.loadAuthData().pipe(
      map(authData => {
        // Find user by email
        const user = authData.users.find((u: any) => 
          u.email === request.email && u.isActive
        );

        if (!user) {
          return {
            success: false,
            message: 'User not found or account is inactive'
          };
        }

        // Check password
        if (user.password !== request.password) {
          return {
            success: false,
            message: 'Invalid email or password'
          };
        }

        // Generate mock token
        const token = this.generateMockToken(user);

        // Store user data
        this.currentUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isActive: user.isActive
        };

        // Store in localStorage if remember me is checked
        if (request.remember) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
          sessionStorage.setItem('authToken', token);
          sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        return {
          success: true,
          message: 'Login successful',
          user: this.currentUser,
          token: token
        };
      }),
      catchError(error => {
        return of({
          success: false,
          message: 'Login service unavailable'
        });
      })
    );
  }

  // Register method
  register(request: RegisterRequest): Observable<LoginResponse> {
    if (request.password !== request.confirmPassword) {
      return of({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (!request.termsAccepted) {
      return of({
        success: false,
        message: 'You must accept the terms and conditions'
      });
    }

    return this.loadAuthData().pipe(
      map(authData => {
        // Check if email already exists
        const existingUser = authData.users.find((u: any) => 
          u.email === request.email
        );

        if (existingUser) {
          return {
            success: false,
            message: 'Email already registered'
          };
        }

        // Check if username already exists
        const existingUsername = authData.users.find((u: any) => 
          u.username === request.username
        );

        if (existingUsername) {
          return {
            success: false,
            message: 'Username already taken'
          };
        }

        // Create new user (in real app, this would be sent to server)
        const newUser: AuthUser = {
          id: (authData.users.length + 1).toString(),
          username: request.username,
          email: request.email,
          fullName: request.fullName,
          role: 'user',
          isActive: true
        };

        // Generate mock token
        const token = this.generateMockToken(newUser);

        // Store user data
        this.currentUser = newUser;
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return {
          success: true,
          message: 'Registration successful',
          user: this.currentUser,
          token: token
        };
      }),
      catchError(error => {
        return of({
          success: false,
          message: 'Registration service unavailable'
        });
      })
    );
  }

  // Forgot password method
  forgotPassword(email: string): Observable<{success: boolean, message: string}> {
    return this.loadAuthData().pipe(
      map(authData => {
        const user = authData.users.find((u: any) => u.email === email);

        if (!user) {
          return {
            success: false,
            message: 'Email not found'
          };
        }

        // In real app, would send reset email
        return {
          success: true,
          message: 'Password reset link sent to your email'
        };
      }),
      catchError(error => {
        return of({
          success: false,
          message: 'Service unavailable'
        });
      })
    );
  }

  // Reset password method
  resetPassword(token: string, newPassword: string): Observable<{success: boolean, message: string}> {
    return this.loadAuthData().pipe(
      map(authData => {
        const resetRequest = authData.passwordResetRequests?.find((r: any) => 
          r.resetToken === token && !r.isUsed
        );

        if (!resetRequest) {
          return {
            success: false,
            message: 'Invalid or expired reset token'
          };
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(resetRequest.expiresAt);

        if (now > expiresAt) {
          return {
            success: false,
            message: 'Reset token has expired'
          };
        }

        // In real app, would update password in database
        return {
          success: true,
          message: 'Password reset successful'
        };
      }),
      catchError(error => {
        return of({
          success: false,
          message: 'Service unavailable'
        });
      })
    );
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to load from storage
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      return this.currentUser;
    }

    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return !!token && !!this.getCurrentUser();
  }

  // Logout method
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  // Generate mock JWT token
  private generateMockToken(user: AuthUser): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    }));
    const signature = btoa('mock_signature');
    
    return `${header}.${payload}.${signature}`;
  }
}
