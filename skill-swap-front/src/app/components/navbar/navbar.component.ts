import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../../services/auth/state/auth.selector';
import { AuthActions } from '../../services/auth/state/auth.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean> | undefined;
  
  constructor(private store: Store) {}

  ngOnInit() {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  handleLogout() {
    this.store.dispatch(AuthActions.logoutRequested());
  }
}
