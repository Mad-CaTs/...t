import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerpostOptionComponent } from './serpost-option.component';

describe('SerpostOptionComponent', () => {
  let component: SerpostOptionComponent;
  let fixture: ComponentFixture<SerpostOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerpostOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SerpostOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
