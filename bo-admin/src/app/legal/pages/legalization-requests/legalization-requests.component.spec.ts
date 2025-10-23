import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalizationRequestsComponent } from './legalization-requests.component';

describe('LegalizationRequestsComponent', () => {
  let component: LegalizationRequestsComponent;
  let fixture: ComponentFixture<LegalizationRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalizationRequestsComponent]
    });
    fixture = TestBed.createComponent(LegalizationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
