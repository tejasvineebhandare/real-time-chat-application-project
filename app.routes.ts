import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';

export const routes: Routes = [
  { path: 'login', component: AuthPageComponent, canActivate: [guestGuard] },
  { path: 'register', component: AuthPageComponent, canActivate: [guestGuard] },
  { path: 'chat', component: ChatPageComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'chat' },
  { path: '**', redirectTo: 'chat' }
];
