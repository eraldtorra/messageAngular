import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthDataManagerService, UserData } from './auth-data-manager.service';

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
  private authDataManager = inject(AuthDataManagerService);
  private currentUser: AuthUser | null = null;

  // Load auth data from JSON file and merge with localStorage users
  private loadAuthData(): Observable<any> {
    return this.http.get<any>('/assets/data/auth-data.json').pipe(
      map(response => {
        // Get base users from JSON file
        const baseUsers = response.authData.users || [];
        
        // Get additional users from localStorage
        const localUsersJson = localStorage.getItem('registeredUsers');
        const localUsers = localUsersJson ? JSON.parse(localUsersJson) : [];
        
        // Merge users
        const allUsers = [...baseUsers, ...localUsers];
        
        return {
          users: allUsers,
          ...response.authData
        };
      }),
      catchError(error => {
        console.error('Error loading auth data:', error);
        // If JSON fails, at least return localStorage users
        const localUsersJson = localStorage.getItem('registeredUsers');
        const localUsers = localUsersJson ? JSON.parse(localUsersJson) : [];
        
        return of({
          users: localUsers,
          passwordResetRequests: []
        });
      })
    );
  }

  // Login method
  login(request: LoginRequest): Observable<LoginResponse> {
    // Find user using AuthDataManager
    const user = this.authDataManager.findUserByEmail(request.email);

    if (!user) {
      return of({
        success: false,
        message: 'User not found or account is inactive'
      });
    }

    if (!user.isActive) {
      return of({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Check password
    if (user.password !== request.password) {
      return of({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    this.authDataManager.updateLastLogin(user.id);

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

    return of({
      success: true,
      message: 'Login successful',
      user: this.currentUser,
      token: token
    });
  }

  // Helper method to update last login time
  private updateLastLogin(userId: string): void {
    const localUsersJson = localStorage.getItem('registeredUsers');
    if (localUsersJson) {
      const localUsers = JSON.parse(localUsersJson);
      const userIndex = localUsers.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        localUsers[userIndex].lastLogin = new Date().toISOString();
        localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
      }
    }
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

    // Check if email already exists
    const existingEmailUser = this.authDataManager.findUserByEmail(request.email);
    if (existingEmailUser) {
      return of({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if username already exists
    const existingUsernameUser = this.authDataManager.findUserByUsername(request.username);
    if (existingUsernameUser) {
      return of({
        success: false,
        message: 'Username already taken'
      });
    }

    try {
      // Create new user using AuthDataManager
      const newUser = this.authDataManager.addUser({
        username: request.username,
        email: request.email.toLowerCase(),
        password: request.password,
        fullName: request.fullName,
        phone: request.phone || '',
        role: 'user',
        isActive: true,
        lastLogin: null,
        newsletterSubscription: request.newsletterSubscription || false
      });

      // Create AuthUser object for session
      const authUser: AuthUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        isActive: newUser.isActive
      };

      // Generate mock token
      const token = this.generateMockToken(authUser);

      // Store user data in session
      this.currentUser = authUser;
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      // Print updated auth data to console
      setTimeout(() => {
        console.log('🎉 REGISTRATION SUCCESSFUL!');
        console.log('💾 User saved to auth-data structure');
        this.authDataManager.printAuthDataToConsole();
      }, 100);

      return of({
        success: true,
        message: 'Registration successful - Data saved to auth-data structure',
        user: this.currentUser,
        token: token
      });

    } catch (error) {
      return of({
        success: false,
        message: 'Registration failed: ' + error
      });
    }
  }

    // Get all users (for debugging)
  getAllUsers(): UserData[] {
    return this.authDataManager.getAllUsers();
  }

  // Export auth data as downloadable file  
  downloadAuthData(): void {
    this.authDataManager.downloadAuthDataFile();
  }

  // Print auth data to console
  printAuthDataToConsole(): void {
    this.authDataManager.printAuthDataToConsole();
  }

  // Reset database (for testing)
  resetDatabase(): Observable<void> {
    return this.authDataManager.resetAuthData();
  }

  // Helper method to generate unique user ID
  private generateUserId(existingUsers: any[]): string {
    let maxId = 0;
    existingUsers.forEach(user => {
      const id = parseInt(user.id);
      if (id > maxId) {
        maxId = id;
      }
    });
    return (maxId + 1).toString();
  }

  // Forgot password method
  forgotPassword(email: string): Observable<{success: boolean, message: string}> {
    const user = this.authDataManager.findUserByEmail(email);

    if (!user) {
      return of({
        success: false,
        message: 'Email not found'
      });
    }

    // In real app, would send reset email
    return of({
      success: true,
      message: 'Password reset link sent to your email'
    });
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

  // Helper method to clear all registered users (for testing)
  clearRegisteredUsers(): void {
    localStorage.removeItem('registeredUsers');
  }

  // Get all registered users (for debugging)
  getRegisteredUsers(): any[] {
    const localUsersJson = localStorage.getItem('registeredUsers');
    return localUsersJson ? JSON.parse(localUsersJson) : [];
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
