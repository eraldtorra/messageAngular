import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';

interface ChatMessage {
  content?: string;
  sender: string;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  private client: Client;
  // private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  // public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  // Replace BehaviorSubject with Signal
  private messagesSignal = signal<Message[]>([]);
  // Create a readonly signal for public use
  public messages = this.messagesSignal.asReadonly();

  constructor() {
    // add fetchMessages() to the constructor


    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        this.client.subscribe('/topic/public', (message) => {
          const newMessage: Message = JSON.parse(message.body);
          // Update the messages array with the new message

          this.messagesSignal.update((messages) => [...messages, newMessage]);
          // this.messagesSubject.next([...this.messagesSubject.value, newMessage]);
        });
      },
    });
    this.client.activate();
    this.getMesssages();
  }

  sendMessage(message: ChatMessage): void {
    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  }

  getMesssages(){
    return this.http.get<Message[]>(`${this.apiUrl}/messages`).subscribe({
      next: (messages) => {
        this.messagesSignal.set(messages);
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
      }
    });

  }


}
