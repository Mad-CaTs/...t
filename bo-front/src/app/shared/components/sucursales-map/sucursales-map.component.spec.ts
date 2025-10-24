import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesMapComponent } from './sucursales-map.component';

describe('SucursalesMapComponent', () => {
  let component: SucursalesMapComponent;
  let fixture: ComponentFixture<SucursalesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalesMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucursalesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
