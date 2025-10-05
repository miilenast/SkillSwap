import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../services/auth/state/auth.reducer';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs';
import { selectIsAuthLoaded, selectIsLoggedIn } from '../services/auth/state/auth.selector';

export const AuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AuthState>)
  const router = inject(Router);

  return store.select(selectIsAuthLoaded).pipe(
    filter(loaded => loaded),
    take(1),
    switchMap(() => store.select(selectIsLoggedIn)),
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
