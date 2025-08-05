import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, AvatarModule],
  templateUrl: './account-info.component.html',
  styles: [`
    .account-info-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
    }
    
    .account-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .field label {
      color: #6b7280;
      font-size: 0.9rem;
    }
    
    .field p {
      margin: 0;
      font-size: 1rem;
    }
  `]
})
export class AccountInfoComponent {
  constructor(private router: Router) {}
  
  goBack() {
    this.router.navigate(['/home']);
  }
}
