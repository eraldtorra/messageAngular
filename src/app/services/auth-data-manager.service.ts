import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface UserData {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  registeredAt: string;
  lastLogin: string | null;
  newsletterSubscription?: boolean;
}

export interface AuthDataStructure {
  authData: {
    users: UserData[];
    loginCredentials: any[];
    registrationData: any[];
    passwordResetRequests: any[];
    authSettings: any;
  };
  metadata: {
    version: string;
    lastUpdated: string;
    totalUsers: number;
    activeUsers: number;
    totalLoginCredentials: number;
    totalRegistrations: number;
    pendingPasswordResets: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthDataManagerService {
  private readonly AUTH_DATA_KEY = 'auth_data_storage';
  private readonly INITIALIZED_KEY = 'auth_data_initialized';
  
  private authDataSubject = new BehaviorSubject<AuthDataStructure | null>(null);
  public authData$ = this.authDataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthData();
  }

  // Initialize auth data from JSON file and localStorage
  private async initializeAuthData(): Promise<void> {
    const isInitialized = localStorage.getItem(this.INITIALIZED_KEY);
    
    if (!isInitialized) {
      // Load initial data from JSON file
      try {
        const response = await this.http.get<any>('/assets/data/auth-data.json').toPromise();
        const initialData: AuthDataStructure = {
          authData: {
            users: response.authData.users || [],
            loginCredentials: response.authData.loginCredentials || [],
            registrationData: response.authData.registrationData || [],
            passwordResetRequests: response.authData.passwordResetRequests || [],
            authSettings: response.authData.authSettings || this.getDefaultAuthSettings()
          },
          metadata: response.metadata || this.getDefaultMetadata()
        };

        // Save to localStorage
        localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(initialData));
        localStorage.setItem(this.INITIALIZED_KEY, 'true');
        
        this.authDataSubject.next(initialData);
        console.log('✅ Auth data initialized from auth-data.json');
        console.log(`📊 Loaded ${initialData.authData.users.length} users`);
        
      } catch (error) {
        console.error('❌ Failed to load auth-data.json, using empty structure:', error);
        const emptyData = this.createEmptyAuthData();
        localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(emptyData));
        localStorage.setItem(this.INITIALIZED_KEY, 'true');
        this.authDataSubject.next(emptyData);
      }
    } else {
      // Load from localStorage
      const storedData = localStorage.getItem(this.AUTH_DATA_KEY);
      if (storedData) {
        const authData = JSON.parse(storedData);
        this.authDataSubject.next(authData);
        console.log('✅ Auth data loaded from localStorage');
      }
    }
  }

  // Get current auth data
  public getAuthData(): AuthDataStructure | null {
    const storedData = localStorage.getItem(this.AUTH_DATA_KEY);
    return storedData ? JSON.parse(storedData) : null;
  }

  // Add new user to auth data
  public addUser(userData: Omit<UserData, 'id' | 'registeredAt'>): UserData {
    const currentData = this.getAuthData();
    if (!currentData) {
      throw new Error('Auth data not initialized');
    }

    // Generate unique ID
    const newId = this.generateUniqueId(currentData.authData.users);
    
    // Create new user
    const newUser: UserData = {
      ...userData,
      id: newId,
      registeredAt: new Date().toISOString()
    };

    // Add to users array
    currentData.authData.users.push(newUser);
    
    // Update metadata
    currentData.metadata.totalUsers = currentData.authData.users.length;
    currentData.metadata.activeUsers = currentData.authData.users.filter(u => u.isActive).length;
    currentData.metadata.totalRegistrations = currentData.authData.users.filter(
      u => u.registeredAt > '2025-01-01'
    ).length;
    currentData.metadata.lastUpdated = new Date().toISOString().split('T')[0];

    // Save back to localStorage
    localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(currentData));
    this.authDataSubject.next(currentData);

    console.log('✅ New user added to auth-data:', newUser.email);
    console.log('📊 Total users:', currentData.authData.users.length);
    
    return newUser;
  }

  // Find user by email
  public findUserByEmail(email: string): UserData | null {
    const authData = this.getAuthData();
    if (!authData) return null;
    
    return authData.authData.users.find(
      user => user.email.toLowerCase() === email.toLowerCase()
    ) || null;
  }

  // Find user by username
  public findUserByUsername(username: string): UserData | null {
    const authData = this.getAuthData();
    if (!authData) return null;
    
    return authData.authData.users.find(
      user => user.username.toLowerCase() === username.toLowerCase()
    ) || null;
  }

  // Update user's last login
  public updateLastLogin(userId: string): void {
    const authData = this.getAuthData();
    if (!authData) return;

    const userIndex = authData.authData.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      authData.authData.users[userIndex].lastLogin = new Date().toISOString();
      localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData));
      this.authDataSubject.next(authData);
    }
  }

  // Get all users
  public getAllUsers(): UserData[] {
    const authData = this.getAuthData();
    return authData ? authData.authData.users : [];
  }

  // Export auth data as JSON string (for saving to file)
  public exportAuthDataAsJson(): string {
    const authData = this.getAuthData();
    return authData ? JSON.stringify(authData, null, 2) : '{}';
  }

  // Download auth data as file
  public downloadAuthDataFile(): void {
    const jsonData = this.exportAuthDataAsJson();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auth-data-updated.json';
    a.click();
    
    window.URL.revokeObjectURL(url);
    
    console.log('📥 Auth data downloaded as auth-data-updated.json');
    console.log('🔄 You can replace the original auth-data.json with this file');
  }

  // Print current auth data to console
  public printAuthDataToConsole(): void {
    const jsonData = this.exportAuthDataAsJson();
    console.log('📋 CURRENT AUTH-DATA.JSON CONTENT:');
    console.log('='.repeat(60));
    console.log('Copy this content to your auth-data.json file:');
    console.log('='.repeat(60));
    console.log(jsonData);
    console.log('='.repeat(60));
  }

  // Reset auth data (reload from original file)
  public resetAuthData(): Observable<void> {
    localStorage.removeItem(this.AUTH_DATA_KEY);
    localStorage.removeItem(this.INITIALIZED_KEY);
    this.initializeAuthData();
    return of(undefined);
  }

  // Generate unique user ID
  private generateUniqueId(existingUsers: UserData[]): string {
    let maxId = 0;
    existingUsers.forEach(user => {
      const id = parseInt(user.id);
      if (!isNaN(id) && id > maxId) {
        maxId = id;
      }
    });
    return (maxId + 1).toString();
  }

  // Create empty auth data structure
  private createEmptyAuthData(): AuthDataStructure {
    return {
      authData: {
        users: [],
        loginCredentials: [],
        registrationData: [],
        passwordResetRequests: [],
        authSettings: this.getDefaultAuthSettings()
      },
      metadata: this.getDefaultMetadata()
    };
  }

  // Get default auth settings
  private getDefaultAuthSettings(): any {
    return {
      passwordMinLength: 6,
      passwordRequireUppercase: false,
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: false,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 15,
      sessionTimeoutMinutes: 60,
      allowRememberMe: true,
      requireEmailVerification: false
    };
  }

  // Get default metadata
  private getDefaultMetadata(): any {
    return {
      version: "1.0",
      lastUpdated: new Date().toISOString().split('T')[0],
      totalUsers: 0,
      activeUsers: 0,
      totalLoginCredentials: 0,
      totalRegistrations: 0,
      pendingPasswordResets: 0
    };
  }
}
