import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';

interface Channel {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount?: number;
  isOnline?: boolean;
  isMuted?: boolean;
  isGroup?: boolean;
  participants?: string[];
}

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    BadgeModule,
    RippleModule
  ],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.css'
})
export class ChannelListComponent implements OnInit {
  
  channels: Channel[] = [];

  ngOnInit() {
    this.channels = [
      {
        id: 1,
        name: 'Bill Kuphal',
        lastMessage: 'The weather will be perfect for th...',
        timestamp: '9:41 AM',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        isOnline: true
      },
      {
        id: 2,
        name: 'Photographers',
        lastMessage: 'Here\'re my latest drone shots',
        timestamp: '9:16 AM',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        unreadCount: 80,
        isGroup: true
      },
      {
        id: 3,
        name: 'Daryl Bogisich, Ian Daniel, +1',
        lastMessage: 'You: Store is out of stock',
        timestamp: 'Yesterday',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        isMuted: true,
        isGroup: true,
        participants: ['Daryl Bogisich', 'Ian Daniel']
      },
      {
        id: 4,
        name: 'SpaceX Crew-16 Launch',
        lastMessage: 'I\'ve been there!',
        timestamp: 'Thursday',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face',
        isGroup: true
      },
      {
        id: 5,
        name: 'Lela Walsh',
        lastMessage: 'Next time it\'s my turn!',
        timestamp: '12/22/21',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        isOnline: true
      },
      {
        id: 6,
        name: 'Roland Marks',
        lastMessage: '@waldo Glad to hear that 😊',
        timestamp: '12/16/21',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face'
      },
      {
        id: 7,
        name: 'Helen Flatley',
        lastMessage: 'You: Ok',
        timestamp: '12/13/21',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        isOnline: true
      }
    ];
  }

  onChannelClick(channel: Channel) {
    console.log('Selected channel:', channel);
  }
}
