import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { ChannelChatService } from '../../services/channelChat.service';
import { Subscription } from 'rxjs';


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
export class ChannelListComponent implements OnInit, OnDestroy {

  channelService = inject(ChannelChatService);
  
  channels: Channel[] = [];
  selectedChannel = this.channelService.getSelectedChannel();
  private messageSubscription?: Subscription;

  ngOnInit() {
    this.channels = [
      {
        id: 1,
        name: 'Bill Kuphal',
        lastMessage: this.getLastMessage(1),
        timestamp: '9:41 AM',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        isOnline: true
      },
      {
        id: 2,
        name: 'Photographers',
        lastMessage: this.getLastMessage(2),
        timestamp: '9:16 AM',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        unreadCount: 80,
        isGroup: true
      },
      {
        id: 3,
        name: 'Daryl Bogisich',
        lastMessage: this.getLastMessage(3),
        timestamp: 'Yesterday',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        isMuted: true,
        isGroup: true,
        participants: ['Daryl Bogisich', 'Ian Daniel']
      },
      {
        id: 4,
        name: 'SpaceX',
        lastMessage: this.getLastMessage(4),
        timestamp: 'Thursday',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face',
        isGroup: true
      },
      {
        id: 6,
        name: 'Roland Marks',
        lastMessage: this.getLastMessage(6),
        timestamp: '12/16/21',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face'
      },
      {
        id: 7,
        name: 'Helen Flatley',
        lastMessage: this.getLastMessage(7),
        timestamp: '12/13/21',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        isOnline: true
      }
    ];

    // Load sample messages for some channels to demonstrate
    this.channelService.loadSampleMessagesForChannel(1);
    this.channelService.loadSampleMessagesForChannel(2);

    this.channelService.setSelectedChannel(this.channels[0]); // Set the first channel as selected by default
    
    // Subscribe to message changes to update last messages
    this.messageSubscription = this.channelService.messagesChanged$.subscribe((channelId) => {
      this.updateChannelLastMessage(channelId);
    });
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  updateChannelLastMessage(channelId: number) {
    const channel = this.channels.find(c => c.id === channelId);
    if (channel) {
      channel.lastMessage = this.getLastMessage(channelId);
    }
  }

  getLastMessage(channelId: number): string {
    return this.channelService.getLastMessage(channelId);
  }

  onChannelClick(channel: Channel) {
    this.channelService.setSelectedChannel(channel);
  }
}
