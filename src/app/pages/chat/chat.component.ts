import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { UsernameService } from '../../services/username.service';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule,NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {


  private websocketService = inject(WebsocketService);
  usernameService = inject(UsernameService);
  // messages$ = this.websocketService.messages$;

  messages = this.websocketService.messages;

  newMessage = '';
  
  sender = this.usernameService.usernameReadonly();

  

  sendMessage(): void {
   
    if (this.newMessage.trim()) {
      this.websocketService.sendMessage({
        content: this.newMessage,
        sender: this.sender
      });
      this.newMessage = '';
    }
  }
 }
