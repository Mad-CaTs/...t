import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBondDocumentComponent } from './car-bond-document.component';

describe('CarBondDocumentComponent', () => {
  let component: CarBondDocumentComponent;
  let fixture: ComponentFixture<CarBondDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarBondDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarBondDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
