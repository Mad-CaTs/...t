import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyExistsPartnerModalComponent } from './already-exists-partner-modal.component';

describe('AlreadyExistsPartnerModalComponent', () => {
  let component: AlreadyExistsPartnerModalComponent;
  let fixture: ComponentFixture<AlreadyExistsPartnerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlreadyExistsPartnerModalComponent]
    });
    fixture = TestBed.createComponent(AlreadyExistsPartnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
