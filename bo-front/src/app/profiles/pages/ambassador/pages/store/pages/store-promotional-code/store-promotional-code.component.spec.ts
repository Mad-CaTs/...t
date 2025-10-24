import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePromotionalCodeComponent } from './store-promotional-code.component';

describe('StorePromotionalCodeComponent', () => {
  let component: StorePromotionalCodeComponent;
  let fixture: ComponentFixture<StorePromotionalCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorePromotionalCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StorePromotionalCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
