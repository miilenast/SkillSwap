import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkillService } from '../../services/skill-offer/skill-offer.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../services/auth/state/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})

export class LoginComponent {
  formData = {
    username: '',
    password: ''
  };

  constructor(
    private skillService: SkillService,
    private router: Router,
    private store: Store,
  ) {}

  submit() {
    if (!this.formData.username || !this.formData.password) {
      alert('Molimo vas popunite sva obavezna polja.');
      return;
    }

    this.store.dispatch(AuthActions.loginRequested({
      username: this.formData.username,
      password: this.formData.password
    }));
  }
}

  //   this.authService.loginRequest(this.formData).subscribe({
  //     next: (user: any) => {
  //       this.skillService.getUserSkills(localStorage.getItem('userId')!).subscribe({
  //         next: (skills: any) => {
  //           this.router.navigate(['/']);
  //         },
  //         error: (err) => console.error('Greška pri učitavanju skill-ova', err)
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Greška pri prijavi', err);
  //       alert(`Greška: ${err.error?.message || 'Neuspešna prijava'}`);
  //     }
  //   });
  // }
// }
