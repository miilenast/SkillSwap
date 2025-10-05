import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing'; // Za mock-ovanje Store-a
import { AuthGuard } from './auth.guard';
import { selectIsLoggedIn } from '../services/auth/state/auth.selector';
import { first } from 'rxjs/operators';
import { of } from 'rxjs';

describe('AuthGuard (NgRx Store Based)', () => {
  let router: Router;
  let store: MockStore;
  let guard: any;
  
  const initialState = {
    auth: {
      isLoggedIn: false,
      user: null,
      error: null,
      isLoading: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])], 
      providers: [
        provideMockStore({ initialState }), 
      ],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    guard = TestBed.runInInjectionContext(() => AuthGuard(null as any, null as any));

    spyOn(router, 'navigate');
  });

  it('treba da bude kreiran', () => {
    expect(guard).toBeTruthy();
  });

  it('treba da dozvoli rutu ako je korisnik ulogovan (NgRx state)', async () => {
    store.overrideSelector(selectIsLoggedIn, true);
    
    const result = await guard.pipe(first()).toPromise();
    
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('treba da zabrani rutu i preusmeri na /login ako korisnik nije ulogovan', async () => {
    store.overrideSelector(selectIsLoggedIn, false);
    
    const result = await guard.pipe(first()).toPromise();
    
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
