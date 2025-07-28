import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { UsernameService } from '../../services/username.service';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn?: boolean;
  messageType?: 'text' | 'image' | 'link';
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  isRead?: boolean;
}

interface ChatUser {
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgFor,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    BadgeModule,
    TooltipModule,
    RippleModule,
    ScrollPanelModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private router = inject(Router);
  private websocketService = inject(WebsocketService);
  usernameService = inject(UsernameService);

  // Current chat user info
  currentUser: ChatUser = {
    name: 'Bill Kuphal',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    isOnline: true,
    lastSeen: 'Online for 10 mins'
  };

  // Chat messages with rich content
  private sampleMessages: ChatMessage[] = [
    {
      id: '1',
      content: 'Who was that philosopher you shared with me recently?',
      sender: 'Bill Kuphal',
      timestamp: new Date('2024-01-15T14:14:00'),
      isOwn: false,
      messageType: 'text'
    },
    {
      id: '2',
      content: 'That\'s him!',
      sender: 'Roland Barthes',
      timestamp: new Date('2024-01-15T14:15:00'),
      isOwn: true,
      messageType: 'text',
      isRead: true
    },
    {
      id: '3',
      content: 'What was his vision statement?',
      sender: 'Bill Kuphal',
      timestamp: new Date('2024-01-15T14:18:00'),
      isOwn: false,
      messageType: 'text'
    },
    {
      id: '4',
      content: '"Ultimately in order to see a photograph well, it is best to look away or close your eyes."',
      sender: 'Roland Barthes',
      timestamp: new Date('2024-01-15T14:20:00'),
      isOwn: true,
      messageType: 'text',
      isRead: true
    },
    {
      id: '5',
      content: 'Aerial photograph from the Helsinki urban environment division.',
      sender: 'Roland Barthes',
      timestamp: new Date('2024-01-15T14:20:00'),
      isOwn: true,
      messageType: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      isRead: true
    },
    {
      id: '6',
      content: 'Aerial photograph from the Helsinki urban environment division',
      sender: 'Bill Kuphal',
      timestamp: new Date('2024-01-15T14:22:00'),
      isOwn: false,
      messageType: 'text'
    },
    {
      id: '7',
      content: 'Check this',
      sender: 'Bill Kuphal',
      timestamp: new Date('2024-01-15T14:22:00'),
      isOwn: false,
      messageType: 'link',
      linkUrl: 'https://dribbble.com',
      linkTitle: 'Dribbble - Discover the World\'s Top Designers & Creative Professionals',
      linkDescription: 'Find top designers & creative professionals on Dribbble. We are where designers gain inspiration, feedback, community, and jobs.'
    }
  ];

  // Initialize with empty messages to show empty state
  // Change this to this.sampleMessages to show sample data
  chatMessages: ChatMessage[] = [];

  newMessage = '';
  sender = this.usernameService.usernameReadonly();

  ngOnInit() {
    this.getUsernam();
    console.log(this.sender);
  }

  getUsernam(){
    if(this.sender == null || this.sender == ''){
      this.usernameService.getUsername().subscribe((username) => {
        this.sender = username.userName;
        this.usernameService.setUsername(username.userName);
        console.log(this.sender);
      })
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        content: this.newMessage,
        sender: this.sender || 'You',
        timestamp: new Date(),
        isOwn: true,
        messageType: 'text'
      };
      
      this.chatMessages.push(newMsg);
      
      // Also send via websocket if needed
      this.websocketService.sendMessage({
        content: this.newMessage,
        sender: this.sender
      });
      
      this.newMessage = '';
    }
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  loadSampleMessages(): void {
    this.chatMessages = [...this.sampleMessages];
  }

  clearMessages(): void {
    this.chatMessages = [];
  }
  
  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
 }
