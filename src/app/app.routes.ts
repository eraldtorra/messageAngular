import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountInfoComponent } from './pages/account-info/account-info.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { NewGroupComponent } from './pages/new-group/new-group.component';
import { NewDirectMessageComponent } from './pages/new-direct-message/new-direct-message.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [

    {
        path: '',
        component: LoginComponent,
        canActivate: [() => guestGuard()]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [() => guestGuard()]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [() => guestGuard()]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [() => guestGuard()]
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [() => guestGuard()]
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [() => authGuard()]
    },
    {
       path: "messages",
       component: ChatComponent,
       canActivate: [() => authGuard()]
    },
    {
        path: 'account-info',
        component: AccountInfoComponent,
        canActivate: [() => authGuard()]
    },
    {
        path: 'new-group',
        component: NewGroupComponent,
        canActivate: [() => authGuard()]
    },
    {
        path: 'new-direct-message',
        component: NewDirectMessageComponent,
        canActivate: [() => authGuard()]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
