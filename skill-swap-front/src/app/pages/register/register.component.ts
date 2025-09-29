import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {
  formData = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    profilePicture: null as File | null
  };
  profilePreview = '';

  constructor(private authService: AuthService, private router: Router) {}

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.profilePicture = file;
      this.profilePreview = URL.createObjectURL(file);
    }
  }

  submit() {
    const { profilePicture, ...userData } = this.formData;
    
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.username ||
      !userData.email ||
      !userData.password ||
      !userData.address ||
      !userData.phoneNumber
    ) {
      alert('Molimo vas popunite sva obavezna polja.');
      return;
    }

    this.authService.register(userData).subscribe({
      next: (res) => {
        if (profilePicture) {
          this.authService.uploadProfilePicture(res.id, res.token.access_token, profilePicture)
            .subscribe({
              next: () => this.router.navigate(['/login']),
              error: (err) => {
                console.error('Greška pri uploadu slike', err);
                alert('Registracija je uspješna, ali je došlo do greške pri uploadu slike.');
                this.router.navigate(['/login']);
              }
            });
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Greška pri registraciji', err);
        alert(`Došlo je do greške pri registraciji. ${err.error?.message || ''}`);
      }
    });
  }
}