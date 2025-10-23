import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailingRowComponent } from './emailing-row.component';

describe('EmailingRowComponent', () => {
  let component: EmailingRowComponent;
  let fixture: ComponentFixture<EmailingRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailingRowComponent]
    });
    fixture = TestBed.createComponent(EmailingRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
