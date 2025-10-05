import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // <-- ovo
import { App } from './app/app';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './app/services/auth/state/auth.effects';
import { authFeatureKey, authReducer } from './app/services/auth/state/auth.reducer';

bootstrapApplication(App, {
  providers: [
    provideStore(),
    provideState({
      name: authFeatureKey,
      reducer: authReducer
    }),
    provideEffects([
      AuthEffects
    ]),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, 
      multi: true
    },
    provideHttpClient(
      withInterceptorsFromDi()
    ), 
    provideRouter(routes),
  ]
}).catch(err => console.error(err));
