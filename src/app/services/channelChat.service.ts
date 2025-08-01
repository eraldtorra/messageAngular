import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Channel } from '../models/channels';

@Injectable({
  providedIn: 'root'
})
export class ChannelChatService {

  selectedChannel = signal<Channel | null>(null);

  getSelectedChannel() {
    return this.selectedChannel.asReadonly();
  }

  setSelectedChannel(channel: Channel) {
    this.selectedChannel.set(channel);
    console.log('Selected channel:', channel);
    console.log('Channel set in service:', this.selectedChannel());
  }


  
}
