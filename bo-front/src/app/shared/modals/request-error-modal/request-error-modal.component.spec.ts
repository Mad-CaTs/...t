import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestErrorModalComponent } from './request-error-modal.component';

describe('RequestErrorModalComponent', () => {
  let component: RequestErrorModalComponent;
  let fixture: ComponentFixture<RequestErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestErrorModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
