import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegalizationNoticeModal } from './app-legalization-notice-modal.component';


describe('ModalAccountTreeRangeManagerComponent', () => {
  let component: LegalizationNoticeModal;
  let fixture: ComponentFixture<LegalizationNoticeModal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalizationNoticeModal]
    });
    fixture = TestBed.createComponent(LegalizationNoticeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
