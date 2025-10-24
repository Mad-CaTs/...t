import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegalizationPreNoticeModal } from './app-legalization-notice-pre-modal.component';


describe('ModalAccountTreeRangeManagerComponent', () => {
  let component: LegalizationPreNoticeModal;
  let fixture: ComponentFixture<LegalizationPreNoticeModal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalizationPreNoticeModal]
    });
    fixture = TestBed.createComponent(LegalizationPreNoticeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
