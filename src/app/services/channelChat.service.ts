import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Channel } from '../models/channels';
import { Subject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ChannelChatService {

  selectedChannel = signal<Channel | null>(null);
  
  // Store messages for each channel by channel ID
  private channelMessages = new Map<number, ChatMessage[]>();
  
  // Subject to notify when messages change
  private messagesChanged = new Subject<number>();
  public messagesChanged$ = this.messagesChanged.asObservable();

  getSelectedChannel() {
    return this.selectedChannel.asReadonly();
  }

  setSelectedChannel(channel: Channel) {
    this.selectedChannel.set(channel);
    console.log('Selected channel:', channel);
    console.log('Channel set in service:', this.selectedChannel());
  }

  // Get messages for a specific channel
  getChannelMessages(channelId: number): ChatMessage[] {
    if (!this.channelMessages.has(channelId)) {
      this.channelMessages.set(channelId, []);
    }
    return this.channelMessages.get(channelId) || [];
  }

  // Add a message to a specific channel
  addMessageToChannel(channelId: number, message: ChatMessage): void {
    if (!this.channelMessages.has(channelId)) {
      this.channelMessages.set(channelId, []);
    }
    this.channelMessages.get(channelId)?.push(message);
    this.messagesChanged.next(channelId); // Notify that messages changed
  }

  // Clear messages for a specific channel
  clearChannelMessages(channelId: number): void {
    this.channelMessages.set(channelId, []);
  }

  // Load sample messages for a channel (for testing)
  loadSampleMessagesForChannel(channelId: number): void {
    const sampleMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'Hello from this channel!',
        sender: 'User',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isOwn: false,
        messageType: 'text'
      },
      {
        id: '2',
        content: 'This message is specific to this channel',
        sender: 'Me',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        isOwn: true,
        messageType: 'text',
        isRead: true
      }
    ];
    this.channelMessages.set(channelId, sampleMessages);
    this.messagesChanged.next(channelId); // Notify that messages changed
  }

  
  // Get the last message for a channel
  getLastMessage(channelId: number): string {
    const messages = this.getChannelMessages(channelId);
    if (messages.length === 0) {
      return ''; // Empty in Albanian
    }
    
    const lastMessage = messages[messages.length - 1];
    const prefix = lastMessage.isOwn ? 'You: ' : '';
    
    // Truncate long messages
    const content = lastMessage.content.length > 30 
      ? lastMessage.content.substring(0, 30) + '...' 
      : lastMessage.content;
    
    return prefix + content;
  }
}
