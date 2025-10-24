import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCarBonusComponent } from './modal-car-bonus.component';

describe('ModalCarBonusComponent', () => {
  let component: ModalCarBonusComponent;
  let fixture: ComponentFixture<ModalCarBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCarBonusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCarBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
