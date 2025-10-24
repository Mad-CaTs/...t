import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePackagesComponent } from './store-packages.component';

describe('StorePackagesComponent', () => {
  let component: StorePackagesComponent;
  let fixture: ComponentFixture<StorePackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorePackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StorePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
