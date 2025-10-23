import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailingModalComponent } from './emailing-modal.component';

describe('EmailingModalComponent', () => {
  let component: EmailingModalComponent;
  let fixture: ComponentFixture<EmailingModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailingModalComponent]
    });
    fixture = TestBed.createComponent(EmailingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
