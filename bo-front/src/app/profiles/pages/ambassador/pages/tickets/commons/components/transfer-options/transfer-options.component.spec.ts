import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOptionsComponent } from './transfer-options.component';

describe('TransferOptionsComponent', () => {
  let component: TransferOptionsComponent;
  let fixture: ComponentFixture<TransferOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
