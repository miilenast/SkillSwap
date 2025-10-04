import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ContactData {
  phoneNumber: string;
  ime: string;
  prezime: string;
}

@Component({
  selector: 'app-contact-only-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './contact-only.component.html',
  styleUrls: ['./contact-only.component.scss']
})
export class ContactOnlyModal {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ContactData,
    ) { }
}
