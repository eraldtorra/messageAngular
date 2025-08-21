import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { AuthServiceService, AuthUser } from '../../services/AuthService.service';
import { UserDataService } from '../../services/user-data.service';
import { User, UpdateUserRequest } from '../../models/user';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    ButtonModule, 
    CardModule, 
    AvatarModule,
    DialogModule,
    InputTextModule,
    FileUploadModule,
    ToastModule,
    ProgressSpinnerModule,
    TagModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
})
export class AccountInfoComponent implements OnInit {
  currentUser: User | null = null;
  authUser: AuthUser | null = null;
  editProfileVisible = false;
  profileForm: FormGroup;
  loading = false;
  avatarFile: File | null = null;
  loginTime: string = '';
  lastLoginTime: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthServiceService,
    private userDataService: UserDataService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.setLoginTime();
  }

  loadUserProfile() {
    this.loading = true;
    
    // Get authenticated user from AuthService
    this.authUser = this.authService.getCurrentUser();
    
    if (this.authUser) {
      // Try to get additional user data from users.json
      this.userDataService.getUserById(this.authUser.id).subscribe({
        next: (userData) => {
          if (userData) {
            // Merge auth user data with user profile data
            this.currentUser = {
              id: this.authUser!.id,
              username: this.authUser!.username,
              email: this.authUser!.email,
              fullName: this.authUser!.fullName,
              phone: userData.phone || '',
              avatar: userData.avatar || this.generateAvatarUrl(this.authUser!.fullName),
              status: userData.status || 'online',
              memberSince: userData.memberSince || this.formatMemberSince()
            };
          } else {
            // Use auth user data only
            this.currentUser = {
              id: this.authUser!.id,
              username: this.authUser!.username,
              email: this.authUser!.email,
              fullName: this.authUser!.fullName,
              phone: '',
              avatar: this.generateAvatarUrl(this.authUser!.fullName),
              status: 'online',
              memberSince: this.formatMemberSince()
            };
          }
          this.loading = false;
        },
        error: (error) => {
          console.log('User data not found in users.json, using auth data only');
          // Use auth user data only
          this.currentUser = {
            id: this.authUser!.id,
            username: this.authUser!.username,
            email: this.authUser!.email,
            fullName: this.authUser!.fullName,
            phone: '',
            avatar: this.generateAvatarUrl(this.authUser!.fullName),
            status: 'online',
            memberSince: this.formatMemberSince()
          };
          this.loading = false;
        }
      });
    } else {
      // No authenticated user, redirect to login
      this.messageService.add({
        severity: 'warn',
        summary: 'Not Authenticated',
        detail: 'Please log in to view your account information'
      });
      this.router.navigate(['/login']);
      this.loading = false;
    }
  }

  private generateAvatarUrl(fullName: string): string {
    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    // Generate a random avatar from a service like DiceBear or use Unsplash
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=200&background=3b82f6&color=ffffff&rounded=true`;
  }

  private formatMemberSince(): string {
    // Get registration date from auth service if available
    const allUsers = this.authService.getAllUsers();
    const userData = allUsers.find(u => u.id === this.authUser?.id);
    
    if (userData && userData.registeredAt) {
      return new Date(userData.registeredAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }
    
    // Default to current month if no registration date
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  private setLoginTime() {
    this.loginTime = new Date().toLocaleString();
    
    // Get last login from auth service
    if (this.authUser) {
      const allUsers = this.authService.getAllUsers();
      const userData = allUsers.find(u => u.id === this.authUser?.id);
      
      if (userData && userData.lastLogin) {
        this.lastLoginTime = new Date(userData.lastLogin).toLocaleString();
      }
    }
  }
  
  goBack() {
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been successfully logged out'
    });
  }

  getUserRole(): string {
    return this.authUser?.role || 'user';
  }

  getUserRoleSeverity(): string {
    switch (this.authUser?.role) {
      case 'admin': return 'danger';
      case 'moderator': return 'warning';
      default: return 'info';
    }
  }

  getAccountStatus(): string {
    return this.authUser?.isActive ? 'Active' : 'Inactive';
  }

  getAccountStatusSeverity(): string {
    return this.authUser?.isActive ? 'success' : 'danger';
  }
  
  editProfile() {
    if (this.currentUser) {
      this.profileForm.patchValue({
        fullName: this.currentUser.fullName,
        username: this.currentUser.username,
        email: this.currentUser.email,
        phone: this.currentUser.phone || ''
      });
      this.editProfileVisible = true;
    }
  }

  onAvatarSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.avatarFile = file;
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.currentUser) {
          this.currentUser.avatar = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid && this.currentUser) {
      this.loading = true;
      const updateData: UpdateUserRequest = this.profileForm.value;

      // First upload avatar if selected
      if (this.avatarFile) {
        this.userService.uploadAvatar(this.avatarFile).subscribe({
          next: (response) => {
            updateData.avatar = response.avatarUrl;
            this.updateUserProfile(updateData);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warning',
              detail: 'Avatar upload failed, updating other fields'
            });
            this.updateUserProfile(updateData);
          }
        });
      } else {
        this.updateUserProfile(updateData);
      }
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  private updateUserProfile(updateData: UpdateUserRequest) {
    this.userService.updateProfile(updateData).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;
        this.userService.setCurrentUser(updatedUser);
        this.editProfileVisible = false;
        this.loading = false;
        this.avatarFile = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully'
        });
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile'
        });
        
        // For development, update locally
        if (this.currentUser) {
          Object.assign(this.currentUser, updateData);
          this.editProfileVisible = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Local Update',
            detail: 'Profile updated locally (development mode)'
          });
        }
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  cancelEdit() {
    this.editProfileVisible = false;
    this.avatarFile = null;
    this.profileForm.reset();
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'online':
        return 'text-green-600';
      case 'away':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  }
}
