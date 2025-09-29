import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

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

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    if (!this.formData.username || !this.formData.password) {
      alert('Molimo vas popunite sva obavezna polja.');
      return;
    }

    this.authService.loginRequest(this.formData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('userId', JSON.stringify(res.user));
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Greška pri prijavi', err);
        alert(`Greška: ${err.error?.message || 'Neuspešna prijava'}`);
      }
    });
  }
}
