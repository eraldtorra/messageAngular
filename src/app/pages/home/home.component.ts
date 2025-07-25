import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
    TieredMenu
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
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
                label: 'File',
                icon: 'pi pi-file',
            },
            {
                label: 'Edit',
                icon: 'pi pi-file-edit',
            },
            {
                label: 'Search',
                icon: 'pi pi-search'
            }
        ]

    }
}
