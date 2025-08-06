import { Component, inject, OnInit, OnDestroy, Input, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
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
    RippleModule,
    ContextMenuModule
  ],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.css'
})
export class ChannelListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() searchFilter: string = '';
  @Input() showSearchResults: boolean = false;
  @ViewChild('contextMenu') contextMenu!: ContextMenu;

  channelService = inject(ChannelChatService);
  
  channels: Channel[] = [];
  filteredChannels: Channel[] = [];
  selectedChannel = this.channelService.getSelectedChannel();
  private messageSubscription?: Subscription;

  contextMenuItems: MenuItem[] = [];
  selectedChannelForMenu?: Channel;

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

    // Initialize filtered channels
    this.filterChannels();

    // Initialize context menu items
    this.initializeContextMenu();
  }

  initializeContextMenu() {
    this.contextMenuItems = [
      {
        label: 'Mute Notifications',
        icon: 'pi pi-volume-off',
        command: () => this.toggleMute(true)
      },
      {
        label: 'Unmute Notifications',
        icon: 'pi pi-volume-up',
        command: () => this.toggleMute(false)
      },
      {
        separator: true
      },
      {
        label: 'Mark as Read',
        icon: 'pi pi-check',
        command: () => this.markAsRead()
      },
      {
        label: 'Clear Chat History',
        icon: 'pi pi-trash',
        command: () => this.clearChatHistory()
      }
    ];
  }

  ngOnChanges() {
    this.filterChannels();
  }

  filterChannels() {
    if (!this.searchFilter || this.searchFilter.trim() === '') {
      this.filteredChannels = [...this.channels];
    } else {
      const query = this.searchFilter.toLowerCase().trim();
      this.filteredChannels = this.channels.filter(channel => {
        const nameMatch = channel.name.toLowerCase().includes(query);
        const messageMatch = channel.lastMessage?.toLowerCase().includes(query) || false;
        const hasMessages = this.hasMessagesInChannel(channel.id);
        
        // Show channel if name matches or if it has messages that match the search
        return nameMatch || (messageMatch && hasMessages);
      });
    }
  }

  hasMessagesInChannel(channelId: number): boolean {
    const messages = this.channelService.getChannelMessages(channelId);
    return messages.length > 0;
  }

  getMessageCount(channelId: number): number {
    const messages = this.channelService.getChannelMessages(channelId);
    return messages.length;
  }

  getDisplayChannels(): Channel[] {
    return this.filteredChannels;
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

  onChannelRightClick(event: MouseEvent, channel: Channel) {
    this.selectedChannelForMenu = channel;
    this.updateContextMenuItems();
    this.contextMenu.show(event);
    event.preventDefault();
  }

  updateContextMenuItems() {
    if (!this.selectedChannelForMenu) return;

    // Create a fresh context menu based on current channel state
    this.contextMenuItems = [
      {
        label: this.selectedChannelForMenu.isMuted ? 'Unmute Notifications' : 'Mute Notifications',
        icon: this.selectedChannelForMenu.isMuted ? 'pi pi-volume-up' : 'pi pi-volume-off',
        command: () => this.toggleMute(!this.selectedChannelForMenu!.isMuted)
      },
      {
        separator: true
      },
      {
        label: 'Mark as Read',
        icon: 'pi pi-check',
        command: () => this.markAsRead(),
        disabled: !this.selectedChannelForMenu.unreadCount
      },
      {
        label: 'Clear Chat History',
        icon: 'pi pi-trash',
        command: () => this.clearChatHistory()
      }
    ];
  }

  toggleMute(mute: boolean) {
    if (!this.selectedChannelForMenu) return;

    const channelIndex = this.channels.findIndex(c => c.id === this.selectedChannelForMenu!.id);
    if (channelIndex !== -1) {
      this.channels[channelIndex].isMuted = mute;
      // Update filtered channels as well
      const filteredIndex = this.filteredChannels.findIndex(c => c.id === this.selectedChannelForMenu!.id);
      if (filteredIndex !== -1) {
        this.filteredChannels[filteredIndex].isMuted = mute;
      }
      
      // Optional: Add a toast notification
      console.log(`Channel ${this.selectedChannelForMenu.name} ${mute ? 'muted' : 'unmuted'}`);
    }
  }

  markAsRead() {
    if (!this.selectedChannelForMenu) return;

    const channelIndex = this.channels.findIndex(c => c.id === this.selectedChannelForMenu!.id);
    if (channelIndex !== -1) {
      this.channels[channelIndex].unreadCount = undefined;
      // Update filtered channels as well
      const filteredIndex = this.filteredChannels.findIndex(c => c.id === this.selectedChannelForMenu!.id);
      if (filteredIndex !== -1) {
        this.filteredChannels[filteredIndex].unreadCount = undefined;
      }
      
      console.log(`Marked ${this.selectedChannelForMenu.name} as read`);
    }
  }

  clearChatHistory() {
    if (!this.selectedChannelForMenu) return;
    
    // Clear messages for this channel
    this.channelService.clearChannelMessages(this.selectedChannelForMenu.id);
    
    // Update last message
    const channelIndex = this.channels.findIndex(c => c.id === this.selectedChannelForMenu!.id);
    if (channelIndex !== -1) {
      this.channels[channelIndex].lastMessage = '';
      // Update filtered channels as well
      const filteredIndex = this.filteredChannels.findIndex(c => c.id === this.selectedChannelForMenu!.id);
      if (filteredIndex !== -1) {
        this.filteredChannels[filteredIndex].lastMessage = '';
      }
    }
    
    console.log(`Cleared chat history for ${this.selectedChannelForMenu.name}`);
  }
}
