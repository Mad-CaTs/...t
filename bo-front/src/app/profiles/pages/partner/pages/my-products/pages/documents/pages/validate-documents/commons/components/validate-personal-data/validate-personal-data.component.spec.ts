import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePersonalDataComponent } from './validate-personal-data.component';

describe('ValidatePersonalDataComponent', () => {
  let component: ValidatePersonalDataComponent;
  let fixture: ComponentFixture<ValidatePersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatePersonalDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidatePersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
