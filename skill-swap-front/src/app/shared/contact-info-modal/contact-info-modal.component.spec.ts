import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoModal } from './contact-info-modal.component';

describe('ContactInfoModal', () => {
  let component: ContactInfoModal;
  let fixture: ComponentFixture<ContactInfoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactInfoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactInfoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
