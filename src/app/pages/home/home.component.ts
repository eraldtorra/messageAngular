import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/AuthService.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  router = inject(Router);
  auth = inject(AuthServiceService);
  
  navigateToMessages() {
    this.router.navigate(['/messages']);
  }

  logout() {
    this.auth.logout(); 
  }
}
