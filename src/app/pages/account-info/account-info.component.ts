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
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
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
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
})
export class AccountInfoComponent implements OnInit {
  currentUser: User | null = null;
  editProfileVisible = false;
  profileForm: FormGroup;
  loading = false;
  avatarFile: File | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
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
  }

  loadUserProfile() {
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userService.setCurrentUser(user);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user profile'
        });
        this.loading = false;
        // Fallback to mock data for development
        this.setMockUserData();
      }
    });
  }

  private setMockUserData() {
    this.currentUser = {
      id: '1',
      username: 'johndoe',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      status: 'online',
      memberSince: 'January 2024'
    };
  }
  
  goBack() {
    this.router.navigate(['/home']);
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
