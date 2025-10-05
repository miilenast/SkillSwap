import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { AuthActions } from './services/auth/state/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <app-navbar></app-navbar>
    <div style="padding-top: 70px;">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class App implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.store.dispatch(AuthActions.checkAuthStatus());
    }
  }
}

