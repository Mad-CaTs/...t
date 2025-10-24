import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStepsComponent } from './transfer-steps.component';

describe('TransferStepsComponent', () => {
  let component: TransferStepsComponent;
  let fixture: ComponentFixture<TransferStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferStepsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
