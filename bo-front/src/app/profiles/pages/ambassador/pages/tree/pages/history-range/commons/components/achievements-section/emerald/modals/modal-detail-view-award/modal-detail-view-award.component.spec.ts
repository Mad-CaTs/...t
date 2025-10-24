import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailViewAwardComponent } from './modal-detail-view-award.component';

describe('ModalDetailViewAwardComponent', () => {
  let component: ModalDetailViewAwardComponent;
  let fixture: ComponentFixture<ModalDetailViewAwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetailViewAwardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailViewAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
