import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyRequestsComponent } from './pages/myrequest/myrequests.component';
import { RequestSearchComponent } from './pages/request-search/request-search.component';
import { MyOffersComponent } from './pages/myoffers/myoffers.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent , canActivate: [AuthGuard]},
  { path: 'myrequests', component: MyRequestsComponent, canActivate: [AuthGuard] },
  { path: 'request-offers/:id', loadComponent: () => import('./pages/request-offers/request-offers.component').then(m => m.RequestOffersComponent), canActivate: [AuthGuard] },
  { path: 'request-search', component: RequestSearchComponent, canActivate: [AuthGuard] },
  { path: 'myoffers', component: MyOffersComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
