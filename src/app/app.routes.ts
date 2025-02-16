import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [

    {
        path: '',
        component: LoginComponent
    },
    {
       path: "messages",
       component: ChatComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
