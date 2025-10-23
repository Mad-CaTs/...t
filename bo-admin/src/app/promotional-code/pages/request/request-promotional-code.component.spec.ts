import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPromotionalCodeComponent } from './request-promotional-code.component';

describe('RequestPromotionalCodeComponent', () => {
  let component: RequestPromotionalCodeComponent;
  let fixture: ComponentFixture<RequestPromotionalCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestPromotionalCodeComponent]
    });
    fixture = TestBed.createComponent(RequestPromotionalCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
