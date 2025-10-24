import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InresortComponent } from './inresort.component';

describe('InresortComponent', () => {
  let component: InresortComponent;
  let fixture: ComponentFixture<InresortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InresortComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InresortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
