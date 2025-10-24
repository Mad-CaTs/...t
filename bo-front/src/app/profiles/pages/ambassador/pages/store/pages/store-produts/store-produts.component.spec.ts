import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProdutsComponent } from './store-produts.component';

describe('StoreProdutsComponent', () => {
  let component: StoreProdutsComponent;
  let fixture: ComponentFixture<StoreProdutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreProdutsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreProdutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
