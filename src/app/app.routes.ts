import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', canActivate:[authGuard], loadChildren: () => import('./home-page/home.routes').then(m => m.HOME_ROUTES)},
    {path: 'login', component: LoginComponent},
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
