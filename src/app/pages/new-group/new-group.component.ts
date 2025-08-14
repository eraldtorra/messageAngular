import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-new-group',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    AvatarModule,
    ChipModule
  ],
  templateUrl: './new-group.component.html',
  styleUrl: './new-group.component.css'
})
export class NewGroupComponent {
  router = inject(Router);
  
  groupName: string = '';
  groupDescription: string = '';
  selectedUsers: string[] = [];
  searchQuery: string = '';
  
  // Mock users for demonstration - replace with actual user service
  availableUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW' }
  ];

  get filteredUsers() {
    return this.availableUsers.filter(user => 
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addUser(user: any) {
    if (!this.selectedUsers.includes(user.name)) {
      this.selectedUsers.push(user.name);
    }
  }

  removeUser(userName: string) {
    this.selectedUsers = this.selectedUsers.filter(name => name !== userName);
  }

  createGroup() {
    if (this.groupName.trim() && this.selectedUsers.length > 0) {
      // Here you would typically call a service to create the group
      console.log('Creating group:', {
        name: this.groupName,
        description: this.groupDescription,
        members: this.selectedUsers
      });
      
      // Navigate back to home or to the new group chat
      this.router.navigate(['/home']);
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
