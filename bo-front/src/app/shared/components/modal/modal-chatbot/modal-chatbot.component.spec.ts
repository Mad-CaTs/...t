import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalChatbotComponent } from './modal-chatbot.component';


describe('ModalDocumentosComponent', () => {
  let component: ModalChatbotComponent;
  let fixture: ComponentFixture<ModalChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalChatbotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
