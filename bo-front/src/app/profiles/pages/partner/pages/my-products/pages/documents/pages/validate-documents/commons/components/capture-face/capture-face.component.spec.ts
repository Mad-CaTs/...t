import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureFaceComponent } from './capture-face.component';

describe('CaptureFaceComponent', () => {
  let component: CaptureFaceComponent;
  let fixture: ComponentFixture<CaptureFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureFaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaptureFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
