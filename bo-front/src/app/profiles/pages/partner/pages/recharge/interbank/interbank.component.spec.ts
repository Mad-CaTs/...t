import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterbankComponent } from './interbank.component';

describe('InterbankComponent', () => {
  let component: InterbankComponent;
  let fixture: ComponentFixture<InterbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterbankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
