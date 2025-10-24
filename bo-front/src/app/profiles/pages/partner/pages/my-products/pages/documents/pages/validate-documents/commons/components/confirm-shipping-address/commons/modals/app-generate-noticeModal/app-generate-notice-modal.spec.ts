import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateNoticeModal } from './app-generate-notice-modal.component'; 

describe('GenerateNoticeModalComponent', () => {
  let component: GenerateNoticeModal;
  let fixture: ComponentFixture<GenerateNoticeModal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateNoticeModal]
    });
    fixture = TestBed.createComponent(GenerateNoticeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});