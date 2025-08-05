import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/AuthService.service';
import { ThemeService } from '../../services/theme.service';
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
  themeService = inject(ThemeService);

   items: MenuItem[] | undefined;

  navigateToMessages() {
    this.router.navigate(['/messages']);
  }

  navigateToAccountInfo() {
    // Navigate to account info page
    this.router.navigate(['/account-info']);
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
    // Update the menu item label and icon
    this.updateMenuItems();
  }

  updateMenuItems() {
    const isDark = this.themeService.isDark()();
    const darkModeItem = this.items?.find(item => item.label?.includes('Mode'));
    if (darkModeItem) {
      darkModeItem.label = isDark ? 'Light Mode' : 'Dark Mode';
      darkModeItem.icon = isDark ? 'pi pi-sun' : 'pi pi-moon';
    }
  }

  logout() {
    this.auth.logout();
  }

   ngOnInit() {
        const isDark = this.themeService.isDark()();
        
        this.items = [
            {
                label: 'Account Name',
                icon: 'pi pi-user',
                command: () => this.navigateToAccountInfo()
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
                separator: true
            },
            {
                label: isDark ? 'Light Mode' : 'Dark Mode',
                icon: isDark ? 'pi pi-sun' : 'pi pi-moon',
                command: () => this.toggleDarkMode()
            },
            {
                label: 'Sign Out',
                icon: 'pi pi-sign-out',
                command: () => this.logout()
            }
        ]

    }
}
