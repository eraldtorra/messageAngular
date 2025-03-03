import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { UsernameService } from '../../services/username.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule,NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private router = inject(Router);


  private websocketService = inject(WebsocketService);
  usernameService = inject(UsernameService);
  // messages$ = this.websocketService.messages$;

  messages = this.websocketService.messages;

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
  
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  sendMessage(): void {
   
    if (this.newMessage.trim()) {
      this.websocketService.sendMessage({
        content: this.newMessage,
        sender: this.sender
      });
      this.newMessage = '';
    }
  }
  
  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
 }
