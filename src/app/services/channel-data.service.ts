import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Channel {
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

export interface ChannelData {
  channels: Channel[];
  metadata: {
    totalChannels: number;
    activeChannels: number;
    totalUnreadMessages: number;
    lastUpdated: string;
    version: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChannelDataService {
  private channelsSubject = new BehaviorSubject<Channel[]>([]);
  public channels$ = this.channelsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadChannels();
  }

  loadChannels(): void {
    this.http.get<ChannelData>('/assets/data/channels.json').subscribe({
      next: (data) => {
        this.channelsSubject.next(data.channels);
      },
      error: (error) => {
        console.error('Error loading channels:', error);
        // Fallback to empty array if file can't be loaded
        this.channelsSubject.next([]);
      }
    });
  }

  getChannels(): Observable<Channel[]> {
    return this.channels$;
  }

  getChannelById(id: number): Observable<Channel | undefined> {
    return this.channels$.pipe(
      map(channels => channels.find(channel => channel.id === id))
    );
  }

  updateChannel(updatedChannel: Channel): void {
    const currentChannels = this.channelsSubject.value;
    const index = currentChannels.findIndex(channel => channel.id === updatedChannel.id);
    
    if (index !== -1) {
      const newChannels = [...currentChannels];
      newChannels[index] = updatedChannel;
      this.channelsSubject.next(newChannels);
    }
  }

  addChannel(newChannel: Channel): void {
    const currentChannels = this.channelsSubject.value;
    this.channelsSubject.next([...currentChannels, newChannel]);
  }

  removeChannel(channelId: number): void {
    const currentChannels = this.channelsSubject.value;
    const filteredChannels = currentChannels.filter(channel => channel.id !== channelId);
    this.channelsSubject.next(filteredChannels);
  }

  markChannelAsRead(channelId: number): void {
    const currentChannels = this.channelsSubject.value;
    const index = currentChannels.findIndex(channel => channel.id === channelId);
    
    if (index !== -1) {
      const newChannels = [...currentChannels];
      newChannels[index] = { ...newChannels[index], unreadCount: 0 };
      this.channelsSubject.next(newChannels);
    }
  }

  toggleChannelMute(channelId: number): void {
    const currentChannels = this.channelsSubject.value;
    const index = currentChannels.findIndex(channel => channel.id === channelId);
    
    if (index !== -1) {
      const newChannels = [...currentChannels];
      newChannels[index] = { 
        ...newChannels[index], 
        isMuted: !newChannels[index].isMuted 
      };
      this.channelsSubject.next(newChannels);
    }
  }

  updateChannelLastMessage(channelId: number, message: string, timestamp: string): void {
    const currentChannels = this.channelsSubject.value;
    const index = currentChannels.findIndex(channel => channel.id === channelId);
    
    if (index !== -1) {
      const newChannels = [...currentChannels];
      newChannels[index] = { 
        ...newChannels[index], 
        lastMessage: message,
        timestamp: timestamp
      };
      this.channelsSubject.next(newChannels);
    }
  }

  searchChannels(query: string): Observable<Channel[]> {
    return this.channels$.pipe(
      map(channels => {
        if (!query || query.trim() === '') {
          return channels;
        }
        
        const searchTerm = query.toLowerCase().trim();
        return channels.filter(channel => {
          const nameMatch = channel.name.toLowerCase().includes(searchTerm);
          const messageMatch = channel.lastMessage?.toLowerCase().includes(searchTerm) || false;
          const participantMatch = channel.participants?.some(participant => 
            participant.toLowerCase().includes(searchTerm)
          ) || false;
          
          return nameMatch || messageMatch || participantMatch;
        });
      })
    );
  }
}
