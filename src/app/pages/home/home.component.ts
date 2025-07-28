import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/AuthService.service';
import { SplitterModule } from 'primeng/splitter';
import { ChannelListComponent } from '../channel-list/channel-list.component';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { ChatComponent } from "../chat/chat.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SplitterModule,
    ChannelListComponent,
    InputIcon,
    IconField,
    InputTextModule,
    FormsModule,
    ButtonModule,
    TieredMenu,
    ChatComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  auth = inject(AuthServiceService);

   items: MenuItem[] | undefined;

  navigateToMessages() {
    this.router.navigate(['/messages']);
  }

  logout() {
    this.auth.logout();
  }

   ngOnInit() {

        this.items = [
            {
                label: 'Acconts Name',
                icon: 'pi pi-user',
            },
            {
                label: 'Mentions',
                icon: 'pi pi-at',
            },
            {
                label: 'New Direct Message',
                icon: 'pi pi-pencil'
            },
            {
                label: 'New Group',
                icon: 'pi pi-users'
            },
            {
                label: 'Dark Mode',
                icon: 'pi pi-moon'
            },
            {
                label: 'Sign Out',
                icon: 'pi pi-user'
            }
        ]

    }
}
