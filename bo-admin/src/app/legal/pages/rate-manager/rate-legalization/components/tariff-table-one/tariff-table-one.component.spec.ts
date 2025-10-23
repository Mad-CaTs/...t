import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffTableOneComponent } from './tariff-table-one.component';

describe('TariffTableOneComponent', () => {
  let component: TariffTableOneComponent;
  let fixture: ComponentFixture<TariffTableOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TariffTableOneComponent]
    });
    fixture = TestBed.createComponent(TariffTableOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
