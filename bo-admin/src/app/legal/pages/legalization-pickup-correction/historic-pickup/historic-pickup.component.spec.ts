import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricPickupComponent } from './historic-pickup.component';

describe('HistoricPickupComponent', () => {
  let component: HistoricPickupComponent;
  let fixture: ComponentFixture<HistoricPickupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricPickupComponent]
    });
    fixture = TestBed.createComponent(HistoricPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
