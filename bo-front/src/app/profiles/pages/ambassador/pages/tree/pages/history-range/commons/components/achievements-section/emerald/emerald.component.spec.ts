import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmeraldComponent } from './emerald.component';

describe('EmeraldComponent', () => {
  let component: EmeraldComponent;
  let fixture: ComponentFixture<EmeraldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmeraldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmeraldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
