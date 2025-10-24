import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreServicesComponent } from './store-services.component';

describe('StoreServicesComponent', () => {
  let component: StoreServicesComponent;
  let fixture: ComponentFixture<StoreServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
