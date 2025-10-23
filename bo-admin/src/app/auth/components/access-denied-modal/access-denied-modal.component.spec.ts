import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDeniedModalComponent } from './access-denied-modal.component';

describe('AccessDeniedModalComponent', () => {
  let component: AccessDeniedModalComponent;
  let fixture: ComponentFixture<AccessDeniedModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessDeniedModalComponent]
    });
    fixture = TestBed.createComponent(AccessDeniedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
