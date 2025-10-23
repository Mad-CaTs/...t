import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedRequestsComponent } from './validated-requests.component';

describe('ValidatedRequestsComponent', () => {
  let component: ValidatedRequestsComponent;
  let fixture: ComponentFixture<ValidatedRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatedRequestsComponent]
    });
    fixture = TestBed.createComponent(ValidatedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
