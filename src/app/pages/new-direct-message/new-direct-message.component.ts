import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-new-direct-message',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    ChipModule
  ],
  templateUrl: './new-direct-message.component.html',
  styleUrl: './new-direct-message.component.css'
})
export class NewDirectMessageComponent implements OnInit {
  router = inject(Router);
  userDataService = inject(UserDataService);
  
  searchQuery: string = '';
  selectedUser: User | null = null;
  message: string = '';
  availableUsers: User[] = [];
  filteredUsers: User[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userDataService.getAllUsers().subscribe({
      next: (users) => {
        this.availableUsers = users;
        this.filteredUsers = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  onSearchChange() {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = this.availableUsers;
    } else {
      this.filteredUsers = this.availableUsers.filter(user => 
        user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.searchQuery = user.fullName;
  }

  clearSelection() {
    this.selectedUser = null;
    this.searchQuery = '';
    this.filteredUsers = this.availableUsers;
  }

  startDirectMessage() {
    if (this.selectedUser) {
      // Here you would typically call a service to start a direct message
      console.log('Starting direct message with:', this.selectedUser, 'Message:', this.message);
      
      // Navigate to the chat with the selected user
      this.router.navigate(['/home'], { 
        queryParams: { 
          userId: this.selectedUser.id,
          userName: this.selectedUser.fullName 
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  }
}
