import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullWidthImageComponent } from './full-width-image.component';

describe('FullWidthImageComponent', () => {
  let component: FullWidthImageComponent;
  let fixture: ComponentFixture<FullWidthImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullWidthImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullWidthImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
