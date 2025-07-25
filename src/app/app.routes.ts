import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        // canActivate: [() => authGuard()]
    },
    {
       path: "messages",
       component: ChatComponent,
       canActivate: [() => authGuard()]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
