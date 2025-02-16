import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsernameService } from '../../services/username.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  router = inject(Router);
  usernameService = inject(UsernameService);

  username: string = '';
  


  setMessages() {
    this.usernameService.setUsername(this.username);

    this.router.navigate(['/messages']);
  }

 

 }
