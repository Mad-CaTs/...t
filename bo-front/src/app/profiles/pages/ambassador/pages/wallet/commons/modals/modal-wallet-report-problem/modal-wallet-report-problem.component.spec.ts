import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWalletReportProblemComponent } from './modal-wallet-report-problem.component';

describe('ModalWalletReportProblemComponent', () => {
  let component: ModalWalletReportProblemComponent;
  let fixture: ComponentFixture<ModalWalletReportProblemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWalletReportProblemComponent]
    });
    fixture = TestBed.createComponent(ModalWalletReportProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
