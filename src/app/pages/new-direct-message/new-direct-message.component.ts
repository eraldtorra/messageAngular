import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';

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
export class NewDirectMessageComponent {
  router = inject(Router);
  
  searchQuery: string = '';
  selectedUser: any = null;
  message: string = '';
  
  // Mock users for demonstration - replace with actual user service
  availableUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD', status: 'online' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS', status: 'offline' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', status: 'online' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW', status: 'away' },
    { id: 5, name: 'David Brown', email: 'david@example.com', avatar: 'DB', status: 'online' },
    { id: 6, name: 'Emma Davis', email: 'emma@example.com', avatar: 'ED', status: 'offline' }
  ];

  get filteredUsers() {
    return this.availableUsers.filter(user => 
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.searchQuery = user.name;
  }

  clearSelection() {
    this.selectedUser = null;
    this.searchQuery = '';
  }

  startDirectMessage() {
    if (this.selectedUser) {
      // Here you would typically call a service to start a direct message
      console.log('Starting direct message with:', this.selectedUser, 'Message:', this.message);
      
      // Navigate to the chat with the selected user
      this.router.navigate(['/home'], { 
        queryParams: { 
          userId: this.selectedUser.id,
          userName: this.selectedUser.name 
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
